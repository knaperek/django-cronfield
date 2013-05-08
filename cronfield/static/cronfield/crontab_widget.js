var indexMinute = 0;
var indexHour = 1;
var indexDay = 2;
var indexMonth = 3;
var indexWeekday = 4;

$(document).ready(function() {
	$(".CrontabField").each(function() { 
		$(this).next().after('<div class="cc_wrapper"></div>');
		new CronCalendar($(this), $(this).next().next());
	});
});

// this function creates all 5 cron calendar elements
// and takes care on values updating - inputElement and
// also all 5 multiselects
// inputElement - input of type text where cron string should be defined
// targetElement - destination html element for all 5 cron calendar elements
function CronCalendar(inputElement, targetElement) {
  
	var me = this;
	var nCalendars = 5;
	this.cronStringArray = $(inputElement).val().split(" ", nCalendars);

	// create and initialize all 5 calendar elements
	var labelsMonths = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
	var labelsWeekdays = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
	var calendarElements = new Array();
	calendarElements[indexMinute] = new cronCalendarElement(this, indexMinute, "Minute", 0, 59);
	calendarElements[indexHour] = new cronCalendarElement(this, indexHour, "Hour", 0, 23);
	calendarElements[indexDay] = new cronCalendarElement(this, indexDay, "Day", 1, 31);
	calendarElements[indexMonth] = new cronCalendarElement(this, indexMonth, "Month", 1, 12, labelsMonths);
	calendarElements[indexWeekday] = new cronCalendarElement(this, indexWeekday, "Weekday", 0, 6, labelsWeekdays);
	
	// insert all 5 calendar elements into targetElement -
	// - html element specified in function argument
	calendarElements.forEach(function(element) {
		$(targetElement).append(element.htmlBase);
	});
	
	// bind update function on inputElement string change
	$(inputElement).keyup(function() {me.updateStringArray();});
	$(inputElement).change(function() {me.updateStringArray();});
	
	// parse string from inputElement, update cronStringArray 
	// and call updateFromString function on every calendar element
	this.updateStringArray = function() {
		this.cronStringArray = $(inputElement).val().split(" ", nCalendars);
		calendarElements.forEach(function(element) {
			element.updateFromString();
		});
	}
	
	// updates string in inputElement with actual values from cronStringArray
	this.updateString = function() {
		$(inputElement).val(this.cronStringArray.join(" "));
	}
	
}

// this function is like class
// it is a "schema" for creating a crone html element
function cronCalendarElement(calendar, index, nameLabel, minValue, maxValue, valueLabels) {
	
	this.name = nameLabel;
	this.min = minValue;
	this.max = maxValue;
	this.labels = valueLabels;
	this.size = 10;
	var me = this;
	
	if (this.labels == null) {
		this.labels = new Array();
		for (var i=this.min; i<=this.max; i++) {
			this.labels[i] = i;
		}
	} else {
		for (var i=0; i<this.min; i++) {
			this.labels.unshift(0);
		}
	}
	
	this.htmlSelect = $('<select>').attr('multiple', 'multiple').attr('size', this.size);
	this.htmlOptions = new Array();
	for (var iVal=this.min; iVal<=this.max; iVal++) {
		this.htmlOptions[iVal] = $('<option>').val(iVal).html(this.labels[iVal]);
		$(this.htmlSelect).append(this.htmlOptions[iVal]);
	}
	this.buttonMarkAll = $('<input>').attr('type', 'button').addClass('button').val('Mark all').click(function() {me.markAll();});
	this.buttonReset = $('<input>').attr('type', 'button').addClass('button').val('Reset').click(function() {me.reset();});
	this.textEveryX = $('<input>').attr('type', 'text').addClass('fright');
	this.htmlBase = $('<div>').addClass('cc_element')
								.append($('<label>').html(this.name))
								.append(this.htmlSelect)
								.append(this.buttonMarkAll)
								.append(this.buttonReset)
								.append($('<label>').html('Every').addClass('fleft'))
								.append(this.textEveryX);
	
	this.textEveryX.change(function() {me.updateFromText();});
	this.textEveryX.keyup(function() {me.updateFromText();});
	this.htmlSelect.change(function() {me.updateFromSelect();});
	
	
	
	// called when value in every X text field changes
	// update cronStringArray on index corresponding to actual calendar element
	// according to selected options (and every X text field)
	this.updateFromText = function() {
		var stringParts = calendar.cronStringArray[index].split("/", 2);
		stringParts[1] = $(this.textEveryX).val();
		if (stringParts[1].length > 0) {
			calendar.cronStringArray[index] = stringParts.join("/");
		} else {
			calendar.cronStringArray[index] = stringParts[0];
		}
		calendar.updateString();
	}
	
	// called when element select options changes
	// update cronStringArray on index corresponding to actual calendar element
	// according to selected options (and every X text field)
	this.updateFromSelect = function() {
		var str = '';
		var selected = $(this.htmlSelect).children(":selected");
		var nSelected = selected.length;
		var isInterval;
		var writeComma = true;
		if (nSelected == (this.max - this.min + 1)) {
			str = '*';
		} else {
			for (var i=0; i<nSelected; i++) {
				var val = parseInt($(selected[i]).val(), 10);
				var nextVal = parseInt($(selected[i+1]).val(), 10);
				if (str.length > 0  &&  writeComma) {
					str += ',';
				}
				if (i < nSelected-1  &&  val+1 == nextVal) {
					if (!isInterval) {
						str += val + '-';
						isInterval = true;
						writeComma = false;
					}
				} else {
					str += val;
					writeComma = true;
					isInterval = false;
				}
			}
		}
		if ($(me.textEveryX).val().length > 0) {
			str += '/' + $(me.textEveryX).val();
		}
		calendar.cronStringArray[index] = str;
		calendar.updateString();
	}

	// called directly by function cronCalendar when cron string changes manualy
	// update calendar element - select/unselect options (and every X text field)
	// according to cron cronStringArray on index corresponding to actual calendar element
	this.updateFromString = function() {
		var stringParts = calendar.cronStringArray[index].split("/", 2);
		if (stringParts[1]) {
			$(me.textEveryX).val(stringParts[1]);
		} else {
			$(me.textEveryX).val('');
		}
		me.htmlOptions.forEach(function(element) {
			element.attr('selected', false);
		});
		var intervals = stringParts[0].split(",");
		intervals.forEach(function(interval) {
			if (interval != "*") {
				var parts = interval.split("-", 2);
				if (parts[1]) {
					for (var i=parts[0]; i<=parts[1]; i++) {
						$(me.htmlOptions[i]).attr('selected', 'selected');
					}
				} else {
					$(me.htmlOptions[parts[0]]).attr('selected', 'selected');
				}
			}
		});
	}
	
	// mark all select options of element
	this.markAll = function() {
		me.htmlOptions.forEach(function(element) {
			$(element).attr('selected', 'selected');
		});
		calendar.cronStringArray[index] = "*";
		if ($(me.textEveryX).val().length > 0) {
			calendar.cronStringArray[index] += "/" + $(me.textEveryX).val();
		}
		calendar.updateString();
	}
	
	// reset everything
	this.reset = function() {
		this.htmlOptions.forEach(function(element) {
			element.attr('selected', false);
		});
		$(this.textEveryX).val('');
		calendar.cronStringArray[index] = "*";
		calendar.updateString();
	}
	
	// update from string at the beginning - to load 
	// saved values into graphic calendar
	this.updateFromString();
}
