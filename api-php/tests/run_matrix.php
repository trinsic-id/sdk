<?php
declare(strict_types=1);
$root = dirname(__DIR__, 2); $tests = __DIR__;
$matrix = json_decode(file_get_contents("$root/compatibility.json"), true, flags: JSON_THROW_ON_ERROR);
$versions = $matrix['compatibility']['sdkVersions']['php'];
$config = array_map(fn($key) => trim(getenv($key) ?: throw new RuntimeException("$key is required")), ['TRINSIC_TEST_BASE_URL','TRINSIC_TEST_ACCESS_TOKEN','TRINSIC_TEST_VERIFICATION_PROFILE_ID']);
$targets = [ ['isCurrent'=>true,'label'=>'current branch','package'=>getenv('SDK_PHP_CURRENT_PACKAGE')] ];
$targets[] = ['isCurrent'=>true,'label'=>'origin/main ('.getenv('SDK_ORIGIN_MAIN_REVISION').')','package'=>getenv('SDK_PHP_MAIN_PACKAGE')];
foreach (array_reverse($versions) as $version) $targets[] = ['isCurrent'=>false,'label'=>"trinsic/api@$version",'version'=>$version];
$results=[];
foreach ($targets as $target) {
  $dir = sys_get_temp_dir().'/trinsic-php-compat-'.bin2hex(random_bytes(6)); mkdir($dir, 0700, true);
  $result=['isCurrent'=>$target['isCurrent'],'label'=>$target['label'],'testCases'=>[]]; $output="$dir/result.json";
  try {
    $require = isset($target['package']) ? ['trinsic/api'=>'*'] : ['trinsic/api'=>$target['version']];
    $composer=['repositories'=>isset($target['package']) ? [['type'=>'path','url'=>$target['package'],'options'=>['symlink'=>false]]] : [],'require'=>$require,'config'=>['secure-http'=>true]];
    file_put_contents("$dir/composer.json", json_encode($composer, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES));
    exec('composer update --no-interaction --no-progress --working-dir='.escapeshellarg($dir).' 2>&1', $lines, $code);
    if ($code !== 0) throw new RuntimeException("Composer setup exited with code $code.");
    $installed=json_decode(file_get_contents("$dir/vendor/composer/installed.json"),true); foreach (($installed['packages'] ?? $installed) as $package) if (($package['name']??'')==='trinsic/api') $result['sdkVersion']=$package['version'];
    $env=['SDK_COMPATIBILITY_RESULT_FILE'=>$output,'SDK_IS_CURRENT'=>$target['isCurrent']?'true':'false','SDK_TARGET_LABEL'=>$target['label'],'SDK_VERSION'=>$result['sdkVersion']??'unknown'];
    foreach ($env as $key=>$value) putenv("$key=$value");
    foreach ($config as $index=>$value) putenv(['TRINSIC_TEST_BASE_URL','TRINSIC_TEST_ACCESS_TOKEN','TRINSIC_TEST_VERIFICATION_PROFILE_ID'][$index]."=$value");
    putenv('SDK_COMPATIBILITY_PSO_FIXTURES_PATH='.(getenv('SDK_COMPATIBILITY_PSO_FIXTURES_PATH') ?: ''));
    exec('php '.escapeshellarg("$tests/run_target.php").' '.escapeshellarg("$dir/vendor/autoload.php").' 2>&1', $lines, $code);
    if (is_file($output)) $result['testCases']=json_decode(file_get_contents($output),true,flags:JSON_THROW_ON_ERROR)['testCases']; else throw new RuntimeException('PHP target exited before producing structured results.');
  } catch (Throwable $error) { $result['testCases']=[['id'=>'framework.php-runner','status'=>'failed','durationMs'=>0,'failure'=>['name'=>get_class($error),'message'=>$error->getMessage()]]]; }
  $results[]=$result; exec('rm -rf '.escapeshellarg($dir));
}
$catalog=json_decode(file_get_contents("$root/compatibility-tests.json"),true,flags:JSON_THROW_ON_ERROR)['testCases'];
$report=['$schema'=>'https://trinsic.id/schemas/sdk-compatibility-results-v1.json','schemaVersion'=>1,'run'=>['generatedAt'=>gmdate('c'),'targetBaseUrl'=>rtrim($config[0],'/')],'suite'=>['language'=>'php'],'testCatalog'=>$catalog,'targets'=>$results];
$specPath=getenv('SDK_COMPATIBILITY_OPENAPI_SPEC');
if ($specPath && is_file($specPath)) {
  $spec=json_decode(file_get_contents($specPath),true,flags:JSON_THROW_ON_ERROR); $caseMap=[]; foreach ($catalog as $case) if (($case['kind']??'')==='api-operation') $caseMap[$case['operationId']][]=$case['id'];
  $operations=[]; $ids=[]; foreach (($spec['paths']??[]) as $path=>$item) foreach ($item as $method=>$operation) if (in_array(strtolower($method),['delete','get','head','options','patch','post','put'],true) && isset($operation['operationId'])) { $id=$operation['operationId']; $ids[]=$id; $operations[]=['covered'=>isset($caseMap[$id]),'method'=>strtoupper($method),'operationId'=>$id,'path'=>$path,'testCaseIds'=>$caseMap[$id]??[]]; }
  usort($operations,fn($a,$b)=>[$a['path'],$a['method']]<=>[$b['path'],$b['method']]); $report['apiCoverage']=['covered'=>count(array_filter($operations,fn($operation)=>$operation['covered'])),'total'=>count($operations),'operations'=>$operations,'unmappedTestCaseIds'=>array_values(array_map(fn($case)=>$case['id'],array_filter($catalog,fn($case)=>($case['kind']??'')==='api-operation'&&!in_array($case['operationId'],$ids,true))))];
}
$destination=getenv('SDK_COMPATIBILITY_RESULTS_PATH') ?: "$tests/.results/compatibility.json"; @mkdir(dirname($destination),0777,true); file_put_contents($destination,json_encode($report,JSON_PRETTY_PRINT)."\n");
exit(array_filter($results, fn($target)=>array_filter($target['testCases'],fn($case)=>$case['status']==='failed')) ? 1 : 0);
