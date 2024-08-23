#
# To learn more about a Podspec see http://guides.cocoapods.org/syntax/podspec.html.
# Run `pod lib lint connect_flutter.podspec` to validate before publishing.
#
Pod::Spec.new do |s|
  s.name             = 'TrinsicUI'
  s.version          = '0.0.1'
  s.summary          = 'Trinsic UI library.'
  s.description      = <<-DESC
We help you launch and capture the results of a Trinsic Acceptance session
                       DESC
  s.homepage         = 'https://trinsic.id'
  s.license          = { :file => '../LICENSE' }
  s.author           = { 'Trinsic' => 'hello@trinsic.id' }
  s.source           = { :path => '.' }
  s.source_files = 'Sources/**/*.{swift,h,m}'
  s.platform = :ios, '12.0'
    # Flutter.framework does not contain a i386 slice.
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES', 'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'i386' }
  s.swift_version = '5.0'

  # If your plugin requires a privacy manifest, for example if it uses any
  # required reason APIs, update the PrivacyInfo.xcprivacy file to describe your
  # plugin's privacy impact, and then uncomment this line. For more information,
  # see https://developer.apple.com/documentation/bundleresources/privacy_manifest_files
  # s.resource_bundles = {'connect_flutter_privacy' => ['Resources/PrivacyInfo.xcprivacy']}
end
