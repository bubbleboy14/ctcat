from setuptools import setup

setup(
    name='ctcat',
    version="0.1",
    author='Mario Balibrera',
    author_email='mario.balibrera@gmail.com',
    license='MIT License',
    description='Trust Builder plugin for cantools (ct)',
    long_description='This package provides the interfaces, database models, request handlers, and format conversion logic for a web application that generates the legal documents associated with trusts.',
    packages=[
        'ctcat'
    ],
    zip_safe = False,
    install_requires = [
        "condox >= 0.1"
    ],
    entry_points = '''''',
    classifiers = [
        'Development Status :: 3 - Alpha',
        'Environment :: Console',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Python Modules'
    ],
)
