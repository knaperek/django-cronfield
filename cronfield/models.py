"""
Simple CRON field providing nice javascript-enabled User Interface and Cron format validation.

"""
__author__ = "Jozef Knaperek & Emilia Knaperekova"
__license__ = "GNU GPL"
__maintainer__ = "Jozef Knaperek"
__status__ = "Alfa"


import re
from django.db import models
from django.core.exceptions import ValidationError
from cronfield.forms import CronFormField


def _validate_CRON_string(value):
    """ Validation routine for CRON string in TestingPlan """

    if value.strip() != value:
        raise ValidationError('Leading nor trailing spaces are allowed')
    columns = value.split()
    if columns != value.split(' '):
        raise ValidationError('Use only a single space as a column separator')

    if len(columns) != 5:
        raise ValidationError('Entry has to consist of exactly 5 columns')

    pattern = r'^(\*|\d+(-\d+)?(,\d+(-\d+)?)*)(/\d+)?$'
    p = re.compile(pattern)
    for i, c in enumerate(columns):
        if not p.match(c):
            raise ValidationError("Incorrect value {} in column {}".format(c, i+1))


class CronField(models.CharField):
    """ Model field implementing CRONTAB format checking and defining appropriate default widget. """
    description = "CRONTAB field"
    # default_validators = [_validate_CRON_string]

    def __init__(self, *args, **kwargs):
        # kwargs['validators'] = [_validate_CRON_string]
        defaults = {
            'help_text': 'Minute Hour Day Month Weekday',
            'default': '* * * * *',
            'max_length': 100,
        }
        defaults.update(kwargs)
        return super(CronField, self).__init__(*args, **defaults)

    def formfield(self, **kwargs):
        defaults = {'form_class': CronFormField}
        defaults.update(kwargs)
        return super(CronField, self).formfield(**defaults)

    def validate(self, value, model_instance):
        super(CronField, self).validate(value, model_instance)
        if self.editable:  # Skip validation for non-editable fields.
            _validate_CRON_string(value)
