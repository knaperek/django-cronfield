=====
Django Cronfield
=====

Django CRON field providing nice javascript-enabled User Interface and Crontab format validation.
Works perfectly also with standard Django Admin interface.

Uses jQuery library ver. 1.7.2 hosted on Google CDN

Requirements
-----------
Django 1.4+
Python 2.7+


Quick start
-----------

1. Add "cronfield" to your INSTALLED_APPS setting like this::

      INSTALLED_APPS = (
          ...
          'cronfield',
      )

2. Use CronField in your models.py::

      from cronfield.models import CronField
      ...

      CRON_string = CronField()


3. Look at your model in the Django Admin interface (edit model page).
