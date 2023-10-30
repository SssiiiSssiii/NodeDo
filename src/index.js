import inquirer from "inquirer";
import { Command } from "commander";
import * as fs from "fs";
const program = new Command();

let path = "tasks.txt";
let rowData = fs.readFileSync(`./${path}`, "utf8");
rowData = rowData.length ? JSON.parse(rowData).map((e) => e.task) : [];
let tasks = [...rowData].map((ele) => {
  if(typeof ele === "object") return Object.keys(ele)[0];
  else return ele;
})

let nonCompletedTasks = rowData.filter((e) => typeof e !== "object");

const add = [
  {
    type: "input",
    name: "task",
    message: "Give me the task: ",
  },
];

const complete = [
  {
    type: "checkbox",
    name: "isCompleted",
    message: "Which task want to check it?",
    choices: nonCompletedTasks,
  },
];

const remove = [
  {
    type: "checkbox",
    name: "remove",
    message: "Which task want to remove it?",
    choices: tasks,
  },
];

function display(){
    let rowData =  fs.readFileSync(`./${path}`, "utf8");
    let tasks = JSON.parse(rowData);

    tasks.forEach((ele, index) => {
      if(Object.values(ele.task)[0] === true)
        tasks[index] = {"task": `${Object.keys(ele.task)}`, complete:true};
    })

    console.table(tasks);
};

program.command("complete").alias("c").description("Complete The Task").action(() => {
    inquirer.prompt(complete).then((ans) => {
      if(fs.existsSync(`./${path}`)){
        let completedTasks = Object.values(ans).flat();
        let rowData = JSON.parse(fs.readFileSync(`./${path}`, "utf8"));
          
        rowData.forEach((element, index) => {
          if (completedTasks.includes(element.task))
            rowData[index] = { task: { [element.task]: true } };
        });
        
        fs.writeFileSync(`./${path}`, JSON.stringify(rowData), "utf8");
        console.log("Nice Kick!");
        display();
      }
    });
  });

program.command("remove").alias("r").description("Remove Task").action(() => {
    inquirer.prompt(remove).then((ans) => {
      if (fs.existsSync(`./${path}`)) {
        let tasks = JSON.parse(fs.readFileSync(`./${path}`, "utf8"));
        let tasksToDeleted = ans.remove;

        tasks = tasks.filter((ele) => !tasksToDeleted.includes(ele.task) && !tasksToDeleted.includes(Object.keys(ele.task)[0]));

        fs.writeFileSync(`./${path}`, JSON.stringify(tasks), 'utf-8');
        console.log("Done!");
        display();
      }
    });
  });

program.command("add").alias("a").description("Add Task").action(() => {
    inquirer.prompt(add).then((ans) => {
        if (fs.existsSync(`./${path}`)) {
          let tasks = fs.readFileSync(`./${path}`, 'utf8')
          const tasksAsJson = tasks.length ? JSON.parse(tasks) : [];
          tasksAsJson.push(ans);

          fs.writeFileSync(`./${path}`, JSON.stringify(tasksAsJson), "utf8")
            console.log("Done!");
            display();
        }
      });
  });

  program.command('list').alias('l').description("Display Tasks").action(() => {
    display();
  })

program.parse();
