/In the future will be user's input on AR table
function AR(action_num, description, category, sub_category, owner, secondary_owner, start_date, due_date, priorty) {
    this.action_num = action_num;
    this.description = description;
    this.category = category;
    this.sub_category = sub_category;
    this.owner = owner;
    this.secondary_owner = secondary_owner;
    this.start_date = start_date;
    this.due_date = due_date;
    this.priorty = priorty;
}


var AR5 = new AR("5", "wifi", "HW", "thermal", null, null, new Date('2017-01-01'), new Date('2017-01-20'), "5");

//In the future will be taken from worker's profile
var Hana_qualifacations = ["KPI"];

//In the future will be taken from worker's profile
var Talya_qualifacations = ["KPI", "thermal"];

var qualified = [];

//In the future will be general for all profiles
if ((Hana_qualifacations.indexOf(AR5.category) >= 0) || (Hana_qualifacations.indexOf(AR5.sub_category) >= 0)) {
    qualified.push("Hana");
}

//In the future will be general for all profiles
if ((Talya_qualifacations.indexOf(AR5.category) >= 0) || (Talya_qualifacations.indexOf(AR5.sub_category) >= 0)) {
    qualified.push("Talya");
}

//Temporaly print the result
//console.log(qualified);

//All cuurent ARs. 
//In the future will be taken from the DB
var AR1 = new AR("1", "a", "Services", null, "Hana", "Ofer", new Date('2017-01-03'), new Date('2017-01-13'), "3");
var AR2 = new AR("2", "b", null, "Data Path", "Hana", null, new Date('2016-12-15'), new Date('2017-01-10'), "3");
var AR3 = new AR("3", "c", "HW", "thermal", "Talya", "Nevo", new Date('2017-01-07'), new Date('2017-01-22'), "5");
var AR4 = new AR("4", "d", "HW", "TpT", "Talya", null, new Date('2016-12-15'), new Date('2017-01-25'), "5");

//Array with all the employee current tasks.
////In the future will be taken from worker's profile/user DB
var Hana_tasks = [AR1,AR2];
var Talya_tasks = [AR3,AR4];
var Hana_tasks_tmp = Hana_tasks;
var Talya_tasks_tmp = Talya_tasks;

//Creates array with only relevant ARs of each worker (only between SD to DD) , and if needed - changes start/due date accordingly
var Hana_relevant_tasks = [];
var Talya_relevant_tasks = [];

for (j = 0, len = Hana_tasks_tmp.length; j < len; j++) {
    var i = Hana_tasks_tmp[j];

    if ((i.start_date > AR5.due_date) || (i.due_date < AR5.start_date)) {
        continue;
    }

    else if ((i.start_date <= AR5.start_date) && (i.due_date <= AR5.due_date)) {
        i.start_date = AR5.start_date;
        Hana_relevant_tasks.push(i);
    }

    else if ((i.start_date >= AR5.start_date) && (i.due_date >= AR5.due_date)) {
        i.due_date = AR5.due_date;
        Hana_relevant_tasks.push(i);
    }

    else if ((i.start_date <= AR5.start_date) && (i.due_date >= AR5.due_date)) {
        i.start_date = AR5.start_date;
        i.due_date = AR5.due_date;
        Hana_relevant_tasks.push(i);
    }

    else if ((i.start_date >= AR5.start_date) && (i.due_date <= AR5.due_date)) {
        Hana_relevant_tasks.push(i);
    }
}

for (j = 0, len = Talya_tasks_tmp.length; j < len; j++) {
    var i = Talya_tasks_tmp[j];

    if ((i.start_date > AR5.due_date) || (i.due_date < AR5.start_date)) {
        continue;
    }

    else if ((i.start_date <= AR5.start_date) && (i.due_date <= AR5.due_date)) {
        i.start_date = AR5.start_date;
        Talya_relevant_tasks.push(i);
    }

    else if ((i.start_date >= AR5.start_date) && (i.due_date >= AR5.due_date)) {
        i.due_date = AR5.due_date;
        Talya_relevant_tasks.push(i);
    }

    else if ((i.start_date <= AR5.start_date) && (i.due_date >= AR5.due_date)) {
        i.start_date = AR5.start_date;
        i.due_date = AR5.due_date;
        Talya_relevant_tasks.push(i);
    }

    else if ((i.start_date >= AR5.start_date) && (i.due_date <= AR5.due_date)) {
        Talya_relevant_tasks.push(i);
    }
}

function calculate_length(An_AR) 
{
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var length = 0;
    length = Math.round(Math.abs((An_AR.start_date.getTime() - An_AR.due_date.getTime()) / (oneDay)));
    return length;
}

//array with all araays of the employees tasks
var tasks = [Talya_relevant_tasks, Hana_relevant_tasks];
var name_weight = [];

//function for calculate all tasks weight of one employee
function sum_of_weight(tasks) {
    for (i = 0; i < tasks.length; i++) {
        var sum = 0;
        for (j = 0; j < tasks[i].length; j++) {
            var weight = (calculate_length(tasks[i][j])) * (tasks[i][j].priorty);
            sum += weight;
            if (j == (tasks[i].length)-1) {
                name_weight.push({ name: tasks[i][j].owner, weight: sum });
            }
        }
    }
}

(sum_of_weight(tasks));

var name_numOfArs = [];

function sum_of_ars(tasks) {
    for (i = 0; i < tasks.length; i++) {
        var count = 0;
        for (j = 0; j < tasks[i].length; j++) {
            count++;
            var x = tasks[i][j].owner;
        }
        name_numOfArs.push({ name: x, num: count});
    }
    return name_numOfArs;
}

sum_of_ars(tasks);

var final_array = []

//sort the employees according to they sum
function best_match(name_numOfArs, name_weight) {
        for (i = 0; i < name_numOfArs.length; i++) {
            for (t = 0; t < name_weight.length; t++) {
                if (name_numOfArs[i].name == name_weight[t].name) {
                    var x = (name_numOfArs[i].num) * 10;
                    var final_value = x + name_weight[t].weight;   
                    final_array.push({ name: name_numOfArs[i].name , weight: final_value });
                    }
                }
            }
    return final_array;
}

best_match(name_numOfArs, name_weight);
//console.log("final_array")
//console.log(final_array)

function sort(final_array) {
    function dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
    final_array.sort(dynamicSort("weight"));
}
sort(final_array);
console.log(final_array);

//console.log(sort(name_weight));