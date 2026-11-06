<?php
require getenv('SDK_TEST_PHP_AUTOLOAD');

$config = (new Trinsic\Api\Configuration())
    ->setHost(getenv('SDK_TEST_URL'))
    ->setAccessToken('sdk-header-test-token');
$client = new GuzzleHttp\Client(['headers' => ['X-Test-Header' => 'preserved']]);
(new Trinsic\Api\Api\ProvidersApi($client, $config))->listProviders();
$sessions = new Trinsic\Api\Api\SessionsApi($client, $config);
$sessions->cancelSession('00000000-0000-0000-0000-000000000001');
$sessions->cancelSessionAsync('00000000-0000-0000-0000-000000000001')->wait();
