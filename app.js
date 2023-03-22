import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

//
// DATA
//
const csvFile = "./data/mushrooms.csv"
const trainingLabel = "class"
const ignored = ["class"]

let actualEdible = 0;
let actualPoisonous = 0;
let predictedEdible = 0;
let predictedPoisonous = 0;

//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data)   // gebruik deze data om te trainen
    })
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    // todo : splits data in traindata en testdata
    data.sort(() => (Math.random() - 0.5));

    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    // maak het algoritme aan
    let decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: data,
        categoryAttr: trainingLabel
    })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())

    let json = decisionTree.toJSON()
    let jsonString = JSON.stringify(json)
    console.log(jsonString)

    // todo : maak een prediction met een sample uit de testdata
    let mushroom = testData[0]
    let mushroomPrediction = decisionTree.predict(mushroom)
    console.log(`Survived the mushroom : ${mushroomPrediction}`)

    // todo : bereken de accuracy met behulp van alle test data
    function accuracy(data, tree, label){
        let correct = 0;
        for(let row of data){
            if (row.class === tree.predict(row)){
                correct++
            }
        }

        console.log(`Accuracy ${label} data: ${correct / data.length}`)

        let accuracyValue = document.getElementById('accuracy');
        accuracyValue.innerText = `Accuracy: ${correct / data.length}`;
    }

    accuracy(trainData, decisionTree, "train");
    accuracy(testData, decisionTree, "test");

    for(const row of data){
        if(row.class === "e" && decisionTree.predict(row) === "e") {
            actualEdible++
        }
        else if (row.class === "e" && decisionTree.predict(row) === "p") {
            predictedEdible++
        }
        else if (row.class === "p" && decisionTree.predict(row) === "e"){
            predictedPoisonous++
        }
        else if (row.class === "p" && decisionTree.predict(row) === "p"){
            actualPoisonous++
        }
    }

    let tableActualEdible = document.getElementById('actualEdible');
    tableActualEdible.innerText = actualEdible.toString();

    let tablePredictedPoisonous = document.getElementById('predictedPoisonous');
    tablePredictedPoisonous.innerText = predictedPoisonous.toString();

    let tablePredictedEdible = document.getElementById('predictedEdible');
    tablePredictedEdible.innerText = predictedEdible.toString();

    let tableActualPoisonous = document.getElementById('actualPoisonous');
    tableActualPoisonous.innerText = actualPoisonous.toString();

}



loadData()