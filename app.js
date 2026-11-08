let expenses = JSON.parse(
localStorage.getItem("expenses")
) || [];

let dailyLimit =
localStorage.getItem("dailyLimit") || 75;

document.getElementById("dailyLimit").value =
dailyLimit;

document
.getElementById("dailyLimit")
.addEventListener("change", e => {

dailyLimit = Number(e.target.value);

localStorage.setItem(
"dailyLimit",
dailyLimit
);

updateUI();
});

function todayString(){
return new Date().toISOString().split("T")[0];
}

function addExpense(){

const amount =
Number(document.getElementById("amount").value);

if(!amount || amount <= 0) return;

const category =
document.getElementById("category").value;

const note =
document.getElementById("note").value;

expenses.push({
amount,
category,
note,
date:todayString()
});

localStorage.setItem(
"expenses",
JSON.stringify(expenses)
);

document.getElementById("amount").value="";
document.getElementById("note").value="";

updateUI();
}

function updateUI(){

const today = todayString();

const todayExpenses =
expenses.filter(x => x.date === today);

const total =
todayExpenses.reduce(
(sum,item)=>sum+item.amount,
0
);

document.getElementById(
"todayTotal"
).textContent =
"$" + total.toFixed(2);

const remaining =
dailyLimit - total;

document.getElementById(
"remainingText"
).textContent =
"$" + remaining.toFixed(2) +
" Remaining";

const percent =
Math.min(
(total/dailyLimit)*100,
100
);

const bar =
document.getElementById("progressBar");

bar.style.width =
percent + "%";

bar.style.background =
percent >= 100
? "#ef4444"
: "#22c55e";

renderExpenses();
renderChart();
}

function renderExpenses(){

const today = todayString();

const list =
document.getElementById("expenseList");

list.innerHTML = "";

expenses
.filter(x => x.date === today)
.reverse()
.forEach(item=>{

const li =
document.createElement("li");

li.innerHTML=
`
<span>
${item.category}
${item.note ? "- "+item.note : ""}
</span>
<span>$${item.amount}</span>
`;

list.appendChild(li);

});
}

let chart;

function renderChart(){

const labels = [];
const totals = [];

for(let i=6;i>=0;i--){

let d =
new Date();

d.setDate(
d.getDate()-i
);

let date =
d.toISOString().split("T")[0];

labels.push(
date.substring(5)
);

let total =
expenses
.filter(x=>x.date===date)
.reduce(
(sum,e)=>sum+e.amount,
0
);

totals.push(total);
}

const ctx =
document.getElementById(
"spendChart"
);

if(chart){
chart.destroy();
}

chart = new Chart(ctx,{
type:"bar",
data:{
labels,
datasets:[{
label:"Daily Spending",
data:totals
}]
}
});
}

updateUI();

if("serviceWorker" in navigator){

navigator.serviceWorker
.register("service-worker.js");

}