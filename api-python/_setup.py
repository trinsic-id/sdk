with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name=NAME,
    version=VERSION,
    description="Trinsic API",
    author="trinsic-id",
    author_email="support@trinsic.id",
    url="https://trinsic.id",
    keywords=["Trinsic", "SDK", "Identity verification"],
    install_requires=REQUIRES,
    packages=find_packages(exclude=["test", "tests"]),
    include_package_data=True,
    long_description_content_type='text/markdown',
    long_description=long_description,
    package_data={"trinsic_api": ["py.typed"]},
)