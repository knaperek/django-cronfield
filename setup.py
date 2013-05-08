import os
from setuptools import setup

README = open(os.path.join(os.path.dirname(__file__), 'README.rst')).read()

# allow setup.py to be run from any path
os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

setup(
    name='django-cronfield',
    version='0.2dev',
    packages=['cronfield'],
    include_package_data=True,
    license='BSD License',
    description='Simple CRON field with nice javascript-enabled User Interface and Cron format validation.',
    long_description=README,
    url='https://github.com/knaperek/django-cronfield',
    author='Jozef Knaperek & Emilia Knaperekova',
    author_email='jknaperek@gmail.com',
    classifiers=[
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2.7',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
    ],
)
