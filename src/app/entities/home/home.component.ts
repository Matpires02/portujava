import {AfterViewInit, Component, OnInit} from '@angular/core';
import {equivalencePortugolStudio} from "./equivalence";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  text = 'import java.util.Scanner;\n';
  hidden: boolean = true;
  portugolForm = new FormControl<string>(
    'programa {\n' +
    'funcao inicio() {\n' +
    'inteiro n, fatorial, trid[2][4][3], array[4], matriz[3][4]\n' +
    'escreva("Entre com o valor de n: ")\n' +
    'leia(n)\n' +
    "leia(array[3])\n" +
    'fatorial = 1\n' +
    'para (inteiro i = 1; i <= n; i = i + 1) {\n' +
    'fatorial = fatorial * i\n' +
    '}\n' +
    'escreva("O fatorial de " + n + " é " + fatorial)\n' +
    '}\n' +
    '}'
    , {nonNullable: true, validators: Validators.required});

  types = ['inteiro', 'real', 'logico', 'cadeia']
  variaveis: Object = {};

  private readonly PORTUGOL_EQUIVALENCE = equivalencePortugolStudio;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.addJsToElement('https://www.jdoodle.com/assets/jdoodle-pym.min.js').onload = () => {
      //const e = this.javaIdeElement.nativeElement as HTMLElement;
      /*this.copy = {... this.javaIdeElement}
      e.remove();*/
    }
  }

  addJsToElement(src = 'https://www.jdoodle.com/assets/jdoodle-pym.min.js'): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    document.body.appendChild(script)
    return script;
  }

  transformData() {
    this.hidden = true;
    this.text = 'import java.util.Scanner;\n';
    this.variaveis = {};
    setTimeout(() => {
      this.replaceWords();
    }, 500)
  }

  private replaceWords() {
    let value: string | null = this.portugolForm.value//?.split('\n');
    // substituindo valores
    //const regex = new RegExp('(');
    value = value.replace('funcao inicio()', 'public static void main(String[] args)');
    value = value.replace('limpa()', '');

    value = value.replace('<-', ' <- ');
    value = value.replace('caso contrario', 'default');
    let val: string[] | undefined = value.split('\n');
    //substituindo palavras
    if (val != undefined) {
      for (let i = 0; i < val.length; i++) {
        let spl = val[i];
        spl = spl.replace('(', ' ( ');
        spl = spl.replace(')', ' ) ');
        spl = spl.replace('{', ' {');
        spl = spl.replace('}', ' }');
        spl = spl.replace(/\,/g, ' , ');

        let splitLine = spl.trim().split(' ');
        if (splitLine.includes('leia')) {
          const vars = Object.keys(this.variaveis);
          splitLine.forEach(word => {
            let wordWithoutSpace = word.replace(" ", "");
            if (vars.includes(wordWithoutSpace)) {
              // @ts-ignore
              const type = this.variaveis[wordWithoutSpace];
              this.setScanner(type, wordWithoutSpace);
            }
            // Verificando se a palavra é um array ou matriz
            else if (vars.includes(word.replace(new RegExp("(\\[\\d+\\])+"), ''))) {
              const varNameWithoutBraketsAndNumbers = word.replace(new RegExp("(\\[\\d+\\])+"), '').replace(',', '');
              // @ts-ignore
              const type = this.variaveis[varNameWithoutBraketsAndNumbers];
              this.setScanner(type, word);
            }
          });
        } else {
          for (let j = 0; j < splitLine.length; j++) {
            let word = splitLine[j];
            if (this.types.includes(word) && !splitLine.includes('para')) {
              let replacedArrayVars = this.setVars(spl.replace(',', '$%@#').split(' '), j);
              splitLine = splitLine.map((value1, index) => {
                if (index !== j && replacedArrayVars[index] != "$%@#") {
                  return replacedArrayVars[index];
                }
                return value1;
              })
            }
            // @ts-ignore
            if (this.PORTUGOL_EQUIVALENCE?.[word]) {
              // @ts-ignore
              this.text += this.PORTUGOL_EQUIVALENCE?.[word] + ' ';
            } else {
              //console.log(word)
              this.text += word + ' ';
            }
            if (j === splitLine.length - 1) {
              //console.log(splitLine)
              if (word == '{' || word == '}') {
                this.text += '\n';
              } else if ((splitLine.length == 1 || splitLine.length == 2) && (word == '' || word == ' ')) {
                this.text += '\n';
              } else {
                this.text += ';\n';
              }
            }
          }
          if (splitLine.join(' ').includes('public static void main')) {
            this.text += 'Scanner scan = new Scanner(System.in); \n';
          }
        }
      }
      this.hidden = false;
      this.addJsToElement();
    }
  }

  private setVars(splitLine: string[], startIndex: number) {
    const arrayRegex = new RegExp("\\w+\\[(\\d)+\\]");
    const matrizRegex = new RegExp("\\w+(\\[\\d+\\]){2,}");

    const type: string = splitLine[startIndex];

    for (let i = startIndex + 1; i < splitLine.length; i++) {

      if (splitLine[i] != '' && splitLine[i] != ' ' && splitLine[i] != '$%@#') {

        splitLine[i].replace(" ", '');
        splitLine[i].replace(",", ' ,');
        //Verificando se é uma matriz
        if(splitLine[i].match(matrizRegex)){

          let newString = splitLine[i].slice();
          newString = newString.replace(",", ' ');
          newString = newString.replace(" ", '');
          newString = newString.replace(new RegExp("(\\[\\d+\\]){2,}"), '');
          let brackets = splitLine[i].replace(new RegExp("\\w*"), '').replace(',', '');
          while (brackets.search(new RegExp('\\d')) != -1){
            brackets = brackets.replace(new RegExp("\\d"), '')
          }
          // @ts-ignore
          splitLine[i] = newString +' '+brackets+ ' = new ' + this.getJavaType(type) + ' ' + splitLine[i].match(new RegExp("(\\[\\d+\\]){2,}"))[0] + (splitLine[i].includes(',') ? ',' : '');
          this.variaveis = {...this.variaveis, [newString.replace(',', '')]: type};
        }
        //Verificando se é vetor
        else if (splitLine[i].match(arrayRegex)) {
          let newString = splitLine[i].slice();
          newString = newString.replace(" ", '');
          newString = newString.replace(",", '');
          newString = newString.replace(new RegExp("\\[(\\d+)+\\]"), '');

          // @ts-ignore
          splitLine[i] = newString + '[] = new ' + this.getJavaType(type) + "[" + splitLine[i].match("\\d+")[0] + "]" + (splitLine[i].includes(',') ? ',' : '');
          this.variaveis = {...this.variaveis, [newString.replace(',', '')]: type};
        }
        else {
          this.variaveis = {...this.variaveis, [splitLine[i].replace(',', '')]: type};
        }
      }
    }
    console.log(this.variaveis)
    return splitLine
  }

  private setScanner(type: string, word: string) {
    switch (type) {
      case 'inteiro':
        this.text += word + ' = ';
        this.text += 'scan.nextInt(); \n';
        break;
      case 'real':
        this.text += word + ' = ';
        this.text += 'scan.nextDouble(); \n';
        break;
      case 'cadeia':
        this.text += word + ' = ';
        this.text += 'scan.nextLine(); \n';
        break;
      default:
        this.text += '// não é possivel ter essa entrada de dados\n';
        break;
    }
  }

  private getJavaType(type: string): string {
    switch (type) {
      case 'inteiro':
        return "int";
        break;
      case 'real':
        return "double";
        break;
      case 'cadeia':
        return 'String';
        break;
      default:
        return '';
        break;
    }
  }
}
