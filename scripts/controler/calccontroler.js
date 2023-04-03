class CalcController {
  // conjunto de atributos e metodos
  constructor() {
    // parametros
    this._audio = new Audio("click.mp3");
    this._audioOnOff = false;
    this.lastOperator = "";
    this.lastNumber = "";
    this._operation = [];
    this._locale = "pt-BR";
    this._displayCalEl = document.querySelector("#display");
    this._dateEl = document.querySelector("#data");
    this._timeEL = document.querySelector("#hora");

    //this._displayCalc = "0"; // _privado
    this._currentDate;
    this.initialize();
    this.initButtonsEvent();
    this.initKeybord();
  }

  initialize() {
    //principal manipulando o DOM tanto com o bworser

    // displayCalEl.innerHTML = "4567"; /// pegue esse objeto e coloque essa info em que passo
    // this._dateEl.innerHTML = "01/05/2050";
    // this._timeEL.innerHTML = "00:00";
    this.setDisplayDateInterval();

    setInterval(() => {
      //sempre que ele atualizar
      this.setDisplayDateInterval();
      // this.displayDate = this.currentDate.toLocaleDateString(this._locale);
      // this.displayTime = this.currentDate.toLocaleTimeString(this._locale); vai reutilizar cria um metodo
    }, 1000);

    this.setNumberToDisplay();
    this.pastFromClipbord();

    document.querySelectorAll(".btn-ac").forEach((btn) => {
      btn.addEventListener("dblclick", (e) => {
        this.toggleAudio();
      });
    });
  }

  toggleAudio() {
    // se emtra como true vira folse se entra false vira true
    this._audioOnOff = !this._audioOnOff;

    //  menos linhas indas
    //this._audioOnOff = this._audioOnOff ? false : true; // mesmo if de baixo que pergunta se é true or false

    // if (this._audioOnOff) {
    //   this._audioOnOff = false;
    // } else {
    //   this._audioOnOff = true;
    // }
  }

  playAudio() {
    if (this._audioOnOff) {
      this._audio.currentTime = 0; // forçando a reiniciar sempre no click

      this._audio.play();
    }
  }

  pastFromClipbord() {
    document.addEventListener("paste", (e) => {
      let text = e.clipboardData.getData("Text");

      this.displayCalc = parseFloat(text);
    });
  }

  copyToClipBord() {
    // cirando um input

    let input = document.createElement("input");
    // passando o atributo
    input.value = this.displayCalc;
    // tem que ficar como filgo do body
    document.body.appendChild(input);

    input.select(); // selecionando ele

    document.execCommand("Copy");

    input.remove();
  }

  initKeybord() {
    document.addEventListener("keyup", (e) => {
      this.playAudio();

      switch (e.key) {
        case "Escape":
          this.clerall();
          break;
        case "Backspace":
          this.clearEntry();
          break;
        case "+":
        case "-":
        case "/":
        case "*":
        case "%":
          this.addOperation(e.key);
          break;
        case "Enter":
        case "=":
          this.calc();
          break;

        case ".":
        case ",":
          this.addDot();
          break;

        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.addOperation(parseInt(e.key)); // entendo como texto fazendo casting para number
          break;
        case "c":
          if (e.ctrlKey) this.copyToClipBord();
          break;
      }
    }); // keypress = quando efetivamente aperta  o keydown = quando segura prescionada
    // e keyup=  quando solta
  }

  addEventListenerAll(element, events, fn) {
    // javascript nao suporte mais de um evento
    // convertendo para um array split()
    events.split(" ").forEach((event) => {
      element.addEventListener(event, fn, false);
    });
  }

  clerall() {
    this._operation = []; // zerou o array
    this._lastNumber = ";";
    this._lastOperator = ";";
    this.setNumberToDisplay();
  }

  clearEntry() {
    this._operation.pop();

    this.setNumberToDisplay();
  }

  getLastOperation() {
    return this._operation[this._operation.length - 1];
  }

  setLastOperation(value) {
    this._operation[this._operation.length - 1] = value;
  }

  isOperator(value) {
    // ele vai receber o valor e vai buscar no array
    return ["+", "-", "*", "/", "%"].indexOf(value) > -1;
    // se achar ele vai trazer o index do elemento
  }

  pushOperation(value) {
    this._operation.push(value);

    if (this._operation.length > 3) {
      this.calc();
    }
  }
  getResult() {
    try {
      return eval(this._operation.join(""));
    } catch (e) {
      setTimeout(() => {
        this.setError();
      }, 1);
    }
  }

  calc() {
    let last = "";

    this._lastOperator = this.getLastItem();

    if (this._operation.length < 3) {
      // no caso de ficar colocando igual depois igual de novo
      let firstItem = this._operation[0];
      this._operation = [firstItem, this._lastOperator, this._lastNumber];
    }

    if (this._operation.length > 3) {
      // mais de 3 itens
      last = this._operation.pop(); // vai remover um e retonar o lastnumver que vai recever o resultado
      this._lastNumber = this.getResult();
    } else if (this._operation.length == 3) {
      // se nao cair no if vai no else if

      this._lastNumber = this.getLastItem(false);
    }

    let result = this.getResult(); // junto tudo o val vai somar

    if (last == "%") {
      let percent = (this._operation[0] * this._operation[2]) / 100;
      result = this._operation[0] - percent;

      this._operation = [result];
    } else {
      this._operation = [result]; // depois gera um novo array com resultado e o ultimo numero digitado

      if (last) this._operation.push(last);
    }

    this.setNumberToDisplay();
  }

  getLastItem(isOperator = true) {
    let lastItem;

    for (let i = this._operation.length - 1; i >= 0; i--) {
      if (this.isOperator(this._operation[i]) == isOperator) {
        lastItem = this._operation[i];
        break;
      }
    }

    if (!lastItem) {
      // nao achou o ultimo? continua com o ultimo

      lastItem = isOperator ? this._lastOperator : this.lastNumber;
    }

    return lastItem;
  }

  setNumberToDisplay() {
    // vai aparecer o ultimo numero de um array percorrer de tras para frente
    // for
    // explicado o for

    // for(variavel inicial = valor inicia;até onde vai; vai como? )
    //for (let i = 0                      ; i <=100     ; i++ no caso de um em um icrementando)
    // pra ser decrescente , começa no valor maior  ex:
    // descrecendo(let i = 100 ; i =>0 ; i--)

    let lastNumber = this.getLastItem(false);

    if (!lastNumber) lastNumber = 0;

    this.displayCalc = lastNumber;
  }
  addOperation(value) {
    if (isNaN(this.getLastOperation())) {
      // nao é um numero
      //string
      if (this.isOperator(value)) {
        //  trocar operador
        this.setLastOperation(value);
      } else {
        this.pushOperation(value);

        this.setNumberToDisplay();
      }
    } else {
      // vai checar se o valor passado é um numero se,
      // se for ele junta se nao cai na outra regra
      // é um numero
      //number
      //aula 16 erro mais pra frente
      if (this.isOperator(value)) {
        // eu tinha usado pra validar Numbe(value), porém ele nao juntava o zero
        // cai aqui e coloca o  operador na frente
        this.pushOperation(value); // adicionando no fim do array
      } else {
        let newValue = this.getLastOperation().toString() + value.toString();
        this.setLastOperation(newValue);

        this.setNumberToDisplay();
      }
    }
  }

  setError() {
    this.displayCalc = "ERROR";
  }

  addDot() {
    let lastOperation = this.getLastOperation();

    if (
      typeof lastOperation === "string" &&
      lastOperation.split("").indexOf(".") > -1
    )
      return;
    // verifica  se é um texto e se for faz um split e busca um indexof e sai

    if (this.isOperator(lastOperation) || !lastOperation) {
      this.pushOperation("0.");
    } else {
      this.setLastOperation(lastOperation.toString() + ".");
    }
    this.setNumberToDisplay();
  }

  execBtn(value) {
    this.playAudio(); // executa o audio do botao

    switch (value) {
      //ce = cancel entrey a ultima entrada , AC- clea)
      case "ac":
        this.clerall();
        break;
      case "ce":
        this.clearEntry();
        break;
      case "soma":
        this.addOperation("+");
        break;
      case "subtracao":
        this.addOperation("-");
        break;
      case "divisao":
        this.addOperation("/");
        break;
      case "multiplicacao":
        this.addOperation("*");
        break;
      case "porcento":
        this.addOperation("%");
        break;
      case "igual":
        this.calc();
        break;
      case "ponto":
        this.addDot();
        break;

      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        this.addOperation(parseInt(value)); // entendo como texto fazendo casting para number
        break;

      default:
        this.setError();
        break;
    }
  }

  initButtonsEvent() {
    let buttons = document.querySelectorAll("#buttons > g, #parts > g"); // pegando todos os seletores button com filhos e parts todos os filhos
    // para percorre todos os elementos vai pressisar passar um laço de repetição
    buttons.forEach((btn, index) => {
      this.addEventListenerAll(btn, "click drag ", (e) => {
        // addEventListenerAll pois nao existe esse ALL, foi criado um metodo
        //  vai percorrerpara cada botão

        // console.log(btn.className.baseVal.replace("btn-", "")); // baseval pois é um svg

        let textBtn = btn.className.baseVal.replace("btn-", "");

        this.execBtn(textBtn);
      });

      this.addEventListenerAll(btn, "mouseover mouseup ,", (e) => {
        // aplicando pointer para todos
        btn.style.cursor = "pointer";
      });
    });
  }

  setDisplayDateInterval() {
    this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
  }

  get displayTime() {
    return this._timeEL.innerHTML;
  }
  set displayTime(value) {
    return (this._timeEL.innerHTML = value);
  }

  get displayDate() {
    return this._dateEl.innerHTML;
  }
  set displayDate(value) {
    return (this._dateEl.innerHTML = value);
  }

  get displayCalc() {
    // devolve a informação ( como acessa os valores)
    return this._displayCalEl.innerHTML;
  }

  set displayCalc(value) {
    // modifica o valor do atributo

    // limitando caracteres
    if (value.toString().length > 10) {
      this.setError();
      return false; // limitando o display
    }
    this._displayCalEl.innerHTML = value;
  }

  get currentDate() {
    // let now = new Date();
    // now.toLocaleDateString("pt-br");
    return new Date();
  }

  set currentDate(value) {
    this._currentDate = value;
  }
}

/*
 pense nesse classe como arquivo compactado
 importando é o que a dentro,
 se encontra variaeis e funções
 se chamando metodos e atributos


*/
//Método Construtor e Encapsulamento
/*
Atributo é similar a uma variavel mais tem mais recursos

this. faz referencia ao objeto

encapsulamento == controla o acesso distrubido de um metodo ( public (fala com todos) , protected(so fala com seus pares
  private (somente da propria classe)))

  chamalo para ? amazena ou recupera
  ---
  DOM documente

  ---
  pegando os valores do initializa dinamicamente,
  do displau (numeros , hora e tempo)

  // setinterval para user interface , tem o set time  out

---- programando o botão 

initi buton com o queryselectorAll pega tos eles,
dps adiciona o evento de click
---
multiplos eventos ex: eventodrag clicar e segurar
--- outras estruturas de controle SWIT case na calc
-- tratar os valores adicionados se for numeros ou sinais
isNaN validar se é não é numero ou retorna um bolleano
Number(value) varifica se é um operador ou numero

// eventos de teclado ---

crtl + c + ctrl v acessado o clipbord (area de rtansferencia)
api de audio

limite de 10 caracteres

try , cath()

*/
