/*
  Author: Jack Ducasse;
  Version: 0.1.0;
  (◠‿◠✿)
*/
var Calendar = function (model, options, date) {
    // Default Values
    this.Options = {
        DateTimeFormat: "mmm, yyyy",
        DatetimeLocation: "",
        EventClick: "",
        EventTargetWholeDay: false,
        DisabledDays: [],
        language: "es",
    };
    // Overwriting default values
    for (var key in options) {
        this.Options[key] = typeof options[key] == "string" ? options[key].toLowerCase() : options[key];
    }

    model ? (this.Model = model) : (this.Model = {});
    this.Today = new Date();

    this.Selected = this.Today;
    this.Today.Month = this.Today.getMonth();
    this.Today.Year = this.Today.getFullYear();
    if (date) {
        this.Selected = date;
    }
    this.Selected.Month = this.Selected.getMonth();
    this.Selected.Year = this.Selected.getFullYear();

    this.Selected.Days = new Date(this.Selected.Year, this.Selected.Month + 1, 0).getDate();
    this.Selected.FirstDay = new Date(this.Selected.Year, this.Selected.Month, 1).getDay();
    this.Selected.LastDay = new Date(this.Selected.Year, this.Selected.Month + 1, 0).getDay();

    this.Prev = new Date(this.Selected.Year, this.Selected.Month - 1, 1);
    if (this.Selected.Month == 0) {
        this.Prev = new Date(this.Selected.Year - 1, 11, 1);
    }
    this.Prev.Days = new Date(this.Prev.getFullYear(), this.Prev.getMonth() + 1, 0).getDate();
};

function createCalendar(calendar, element, adjuster) {
    var monthsData = {
        es: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    };

    if (typeof adjuster !== "undefined") {
        var newDate = new Date(calendar.Selected.Year, calendar.Selected.Month + adjuster, 1);
        calendar = new Calendar(calendar.Model, calendar.Options, newDate);
        element.innerHTML = "";
    } else {
        for (var key in calendar.Options) {
            typeof calendar.Options[key] != "function" && typeof calendar.Options[key] != "object" && calendar.Options[key] ? (element.className += " " + key + "-" + calendar.Options[key]) : 0;
        }
    }
    var months = monthsData[calendar.Options.language];

    var mainSection = document.createElement("div");
    mainSection.className += "cld-main";

    function AddDateTime() {
        var datetime = document.createElement("div");
        datetime.className += "cld-datetime";
        var rwd = document.createElement("div");
        rwd.className += " cld-rwd cld-nav";
        rwd.addEventListener("click", function () {
            createCalendar(calendar, element, -1);
        });
        rwd.innerHTML = '<svg height="15" width="15" viewBox="0 0 75 100" fill="rgba(0,0,0,0.5)"><polyline points="0,50 75,0 75,100"></polyline></svg>';
        datetime.appendChild(rwd);
        var today = document.createElement("div");
        today.className += " today";
        today.innerHTML = months[calendar.Selected.Month] + ", " + calendar.Selected.Year;
        datetime.appendChild(today);
        var fwd = document.createElement("div");
        fwd.className += " cld-fwd cld-nav";
        fwd.addEventListener("click", function () {
            createCalendar(calendar, element, 1);
        });
        fwd.innerHTML = '<svg height="15" width="15" viewBox="0 0 75 100" fill="rgba(0,0,0,0.5)"><polyline points="0,0 75,50 0,100"></polyline></svg>';
        datetime.appendChild(fwd);
        if (calendar.Options.DatetimeLocation) {
            document.getElementById(calendar.Options.DatetimeLocation).innerHTML = "";
            document.getElementById(calendar.Options.DatetimeLocation).appendChild(datetime);
        } else {
            mainSection.appendChild(datetime);
        }
    }

    function AddLabels() {
        var labels = document.createElement("ul");
        labels.className = "cld-labels";
        var daysData = {
            es: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
            en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        };
        var labelsList = daysData[calendar.Options.language];
        for (var i = 0; i < labelsList.length; i++) {
            var label = document.createElement("li");
            label.className += "cld-label";
            label.innerHTML = labelsList[i];
            labels.appendChild(label);
        }
        mainSection.appendChild(labels);
    }
    function AddDays() {
        // Create Number Element
        function DayNumber(n) {
            var number = document.createElement("p");
            number.className += "cld-number";
            number.innerHTML += n;
            return number;
        }
        var days = document.createElement("ul");
        days.className += "cld-days";
        // Previous Month's Days
        for (var i = 0; i < calendar.Selected.FirstDay; i++) {
            var day = document.createElement("li");
            day.className += "cld-day prevMonth";
            //Disabled Days
            var d = i % 7;
            for (var q = 0; q < calendar.Options.DisabledDays.length; q++) {
                if (d == calendar.Options.DisabledDays[q]) {
                    day.className += " disableDay";
                }
            }

            var number = DayNumber(calendar.Prev.Days - calendar.Selected.FirstDay + (i + 1));
            day.appendChild(number);

            days.appendChild(day);
        }
        // Current Month's Days
        for (var i = 0; i < calendar.Selected.Days; i++) {
            var day = document.createElement("li");
            day.className += "cld-day currMonth";
            //Disabled Days
            var d = (i + calendar.Selected.FirstDay) % 7;
            for (var q = 0; q < calendar.Options.DisabledDays.length; q++) {
                if (d == calendar.Options.DisabledDays[q]) {
                    day.className += " disableDay";
                }
            }
            var number = DayNumber(i + 1);
            // Check Date against Event Dates
            for (var n = 0; n < calendar.Model.length; n++) {
                var evDate = calendar.Model[n].date;
                var toDate = new Date(calendar.Selected.Year, calendar.Selected.Month, i + 1);
                if (evDate.getTime() == toDate.getTime()) {
                    number.className += " eventday";
                    var title = document.createElement("span");
                    title.className += "cld-title";
                    title.innerHTML += '<a href="' + calendar.Model[n].img + '">' + calendar.Model[n].title + "</a>";
                    if (calendar.Options.EventClick) title.addEventListener("click", calendar.Options.EventClick);

                    number.appendChild(title);
                }
            }
            day.appendChild(number);
            // If Today..
            if (i + 1 == calendar.Today.getDate() && calendar.Selected.Month == calendar.Today.Month && calendar.Selected.Year == calendar.Today.Year) {
                day.className += " today";
            }
            days.appendChild(day);
        }
        // Next Month's Days
        // Always same amount of days in calander
        var extraDays = 13;
        if (days.children.length > 35) {
            extraDays = 6;
        } else if (days.children.length < 29) {
            extraDays = 20;
        }

        for (var i = 0; i < extraDays - calendar.Selected.LastDay; i++) {
            var day = document.createElement("li");
            day.className += "cld-day nextMonth";
            //Disabled Days
            var d = (i + calendar.Selected.LastDay + 1) % 7;
            for (var q = 0; q < calendar.Options.DisabledDays.length; q++) {
                if (d == calendar.Options.DisabledDays[q]) {
                    day.className += " disableDay";
                }
            }

            var number = DayNumber(i + 1);
            day.appendChild(number);

            days.appendChild(day);
        }
        mainSection.appendChild(days);
    }

    element.appendChild(mainSection);

    AddDateTime();
    AddLabels();
    AddDays();
}

export function caleandar(el, data, settings) {
    var obj = new Calendar(data, settings);
    createCalendar(obj, el);
}
