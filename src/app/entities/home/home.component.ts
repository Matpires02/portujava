import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {equivalencePortugolStudio} from "./equivalence";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  //@ViewChild('java') private javaIdeElement!: ElementRef;
  text = 'import java.util.Scanner;\n';
  hidden: boolean = true;
  portugolForm = new FormControl<string>(
    'programa {\n' +
    'funcao inicio() {\n' +
    'inteiro n, fatorial\n' +
    'escreva("Entre com o valor de n: ")\n' +
    'leia(n)\n' +
    'fatorial = 1\n' +
    'para (inteiro i = 1; i <= n; i = i + 1) {\n' +
    'fatorial = fatorial * i\n' +
    '}\n' +
    'escreva("O fatorial de " + n + " é " + fatorial)\n' +
    '}\n' +
    '}'
    , {nonNullable: true, validators: Validators.required});

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
    setTimeout(()=> {
      this.replaceWords();
    }, 500)
  }

  private replaceWords(){
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
        const splitLine = spl.split(' ');
        for (let j = 0; j < splitLine.length; j++) {
          const word = splitLine[j];
          // @ts-ignore
          if (this.PORTUGOL_EQUIVALENCE?.[word]) {
            // @ts-ignore
            this.text += this.PORTUGOL_EQUIVALENCE?.[word] + ' ';
          } else {
            this.text += word + ' ';
          }
          if (j === splitLine.length -1){
            console.log(splitLine)
            if (word == '{' || word == '}') {
              this.text += '\n';
            } else if ((splitLine.length == 1 || splitLine.length==2) && (word == '' || word == ' ')){
              this.text += '\n';
            }
            else{
              this.text += ';\n';
            }
          }
        }
      }
      this.hidden = false;
      this.addJsToElement();
    }
  }
}
