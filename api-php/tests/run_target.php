<?php
declare(strict_types=1);
require $argv[1];
use Trinsic\Api\Configuration;

$results=[]; $started=microtime(true);
function record(string $id, callable $action, array $parameters=[]): mixed { global $results; $start=microtime(true); try { $value=$action(); $results[]=['id'=>$id,'status'=>'passed','durationMs'=>(int)((microtime(true)-$start)*1000),'parameters'=>$parameters ?: null]; return $value; } catch (Throwable $error) { $results[]=['id'=>$id,'status'=>'failed','durationMs'=>(int)((microtime(true)-$start)*1000),'parameters'=>$parameters ?: null,'failure'=>['name'=>get_class($error),'message'=>$error->getMessage()]]; return null; } }
function skipped(string $id,string $reason,array $parameters=[]): void { global $results; $results[]=['id'=>$id,'status'=>'skipped','durationMs'=>0,'parameters'=>$parameters ?: null,'skipReason'=>$reason]; }
function invoke(object $api, string $method, array $arguments=[]): mixed { if (!method_exists($api,$method)) throw new RuntimeException(get_class($api)." does not expose $method."); return $api->$method(...$arguments); }
function value(mixed $object,string $property): mixed { $method='get'.ucfirst($property); return is_object($object) && method_exists($object,$method) ? $object->$method() : null; }
function model(string $name,array $values): object { $class='Trinsic\\Api\\Model\\'.$name; if (!class_exists($class)) throw new RuntimeException("SDK does not expose $name."); return new $class($values); }
function redirectUri(object $redirects): string { $page=invoke($redirects,'list',[1,100]); $data=json_decode(json_encode($page),true); $walk=function($value) use (&$walk): ?string { if (is_string($value) && preg_match('#^https?://#',$value)) return $value; if (is_array($value)) foreach($value as $entry) if(($found=$walk($entry))!==null)return $found; return null; }; return $walk($data) ?? throw new RuntimeException('The test environment must have an HTTP(S) redirect URI.'); }
function compareJson(mixed $actual,mixed $expected,string $path,bool $exact): void { if(is_array($actual)&&is_array($expected)){foreach($actual as $key=>$value){if(!array_key_exists($key,$expected))throw new RuntimeException("$path emitted field absent from fixture: $key.");compareJson($value,$expected[$key],"$path.$key",$exact);}if($exact&&array_keys($actual)!==array_keys($expected))throw new RuntimeException("$path field names differ.");return;}if($actual!==$expected)throw new RuntimeException("$path values differ."); }
$config=new Configuration(); $config->setHost(rtrim(getenv('TRINSIC_TEST_BASE_URL'),'/')); $config->setAccessToken(getenv('TRINSIC_TEST_ACCESS_TOKEN'));
$profile=getenv('TRINSIC_TEST_VERIFICATION_PROFILE_ID');
$providers=new \Trinsic\Api\Api\ProvidersApi(null,$config); $profiles=new \Trinsic\Api\Api\VerificationProfilesApi(null,$config); $sessions=new \Trinsic\Api\Api\SessionsApi(null,$config); $redirects=new \Trinsic\Api\Api\RedirectUrisApi(null,$config);
record('api.providers.list',fn()=>invoke($providers,'listProviders'));
record('api.verification-profiles.get-by-id',fn()=>invoke($profiles,'getVerificationProfileById',[$profile]));
record('api.verification-profiles.list',fn()=>invoke($profiles,'listVerificationProfiles',[1,100]));
record('api.sessions.list',fn()=>invoke($sessions,'listSessions',[$profile]));
record('api.redirect-uris.list',fn()=>invoke($redirects,'list'));
if (method_exists($providers,'getProvider')) record('api.providers.get',fn()=>invoke($providers,'getProvider',['trinsic-test-redirect'])); else skipped('api.providers.get','This SDK does not expose getProvider.');
$hosted=record('api.sessions.create-hosted-provider',function()use($sessions,$redirects,$profile){$response=invoke($sessions,'createHostedProviderSession',[model('CreateHostedProviderSessionRequest',['provider'=>'trinsic-test-redirect','verification_profile_id'=>$profile,'redirect_url'=>redirectUri($redirects),'enable_redirect_backwards_compatibility'=>false])]); $id=value($response,'sessionId'); if(!$id) throw new RuntimeException('Hosted session omitted sessionId.'); invoke($sessions,'cancelSession',[$id]); return $response;});
$direct=record('api.sessions.create-direct-provider',function()use($sessions,$redirects,$profile){return invoke($sessions,'createDirectProviderSession',[model('CreateDirectProviderSessionRequest',['provider'=>'trinsic-test-redirect','verification_profile_id'=>$profile,'redirect_url'=>redirectUri($redirects),'enable_redirect_backwards_compatibility'=>false,'capabilities'=>['LaunchBrowser','CaptureRedirect'],'fallback_to_hosted_ui'=>false])]);});
$directId=$direct ? value($direct,'sessionId') : null;
if($directId){
  record('api.sessions.get',fn()=>invoke($sessions,'getSession',[$directId]));
  $result=record('api.sessions.get-result',fn()=>invoke($sessions,'getSessionResult',[$directId]));
  $attachmentId=null; $walk=function($value)use(&$walk,&$attachmentId){if(is_object($value)&&method_exists($value,'getAttachmentId'))$attachmentId ??= $value->getAttachmentId(); if(is_object($value))foreach(get_object_vars($value) as $entry)$walk($entry); if(is_array($value))foreach($value as $entry)$walk($entry);}; $walk($result);
  if($attachmentId) record('api.sessions.get-attachment',fn()=>invoke($sessions,'getAttachment',[$directId,$attachmentId])); else skipped('api.sessions.get-attachment','The redirect test session did not produce an attachment.');
  record('api.sessions.redact',fn()=>invoke($sessions,'redactSession',[$directId]));
  record('api.sessions.cancel',fn()=>invoke($sessions,'cancelSession',[$directId]));
}else{foreach(['api.sessions.get','api.sessions.get-result','api.sessions.get-attachment','api.sessions.redact','api.sessions.cancel'] as $id)skipped($id,'Direct-session setup failed.');}
record('api.sessions.recommend-providers',fn()=>invoke($sessions,'recommendProviders',[model('RecommendProvidersRequest',['verification_profile_id'=>$profile,'health'=>'All'])]));
$cache=getenv('SDK_COMPATIBILITY_PSO_FIXTURES_PATH');
if (!$cache || !is_file($cache)) { skipped('serialization.provider-output-round-trip','No shared PSO fixture cache was available.'); }
else foreach ((json_decode(file_get_contents($cache),true,flags:JSON_THROW_ON_ERROR)['fixtures'] ?? []) as $fixture) {
  $parameters=['providerId'=>$fixture['providerId']]; if (isset($fixture['sdkModelName'])) $parameters['sdkModelName']=$fixture['sdkModelName'];
  if (empty($fixture['hasPublicSdkModel'])) { skipped('serialization.provider-output-round-trip','Provider has no public Swagger provider-specific output model.',$parameters); continue; }
  $class='Trinsic\\Api\\Model\\'.$fixture['sdkModelName'];
  if (!class_exists($class)) { skipped('serialization.provider-output-round-trip','The SDK does not expose this provider-output model.',$parameters); continue; }
  record('serialization.provider-output-round-trip', function() use($class,$fixture) { if (!isset($fixture['output'])) throw new RuntimeException('Cached fixture omitted output.'); $model=\Trinsic\Api\ObjectSerializer::deserialize(json_encode($fixture['output']),$class,[]); $serialized=\Trinsic\Api\ObjectSerializer::sanitizeForSerialization($model); compareJson($serialized,$fixture['output'],$fixture['providerId'],getenv('SDK_IS_CURRENT')==='true'); },$parameters);
}
$output=getenv('SDK_COMPATIBILITY_RESULT_FILE'); file_put_contents($output,json_encode(['schemaVersion'=>1,'testCases'=>$results],JSON_PRETTY_PRINT)."\n");
exit(array_filter($results,fn($case)=>$case['status']==='failed') ? 1 : 0);
