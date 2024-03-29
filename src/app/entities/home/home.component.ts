import {AfterViewInit, Component, OnInit} from '@angular/core';
import {equivalencePortugolStudio, equivalenceVisuAlg} from './equivalence';
import {FormControl, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {PortugolType} from 'src/app/enums/portugol_type.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  protected text = 'import java.util.Scanner;\n';
  protected hiddenJavaPlugin: boolean = true;
  protected portugolForm = new FormControl<string>('', {
    nonNullable: true,
    validators: Validators.required,
  });
  private types = ['inteiro', 'real', 'logico', 'cadeia', 'caractere'];
  private variaveis: Object = {};
  private codigoDeTeste =
    'programa {\n' +
    'funcao inicio() {\n' +
    'inteiro n, fatorial, trid[2][4][3], array[4], matriz[3][4]\n' +
    'escreva("Entre com o valor de n: ")\n' +
    'leia(n)\n' +
    'leia(array[3])\n' +
    'fatorial = 1\n' +
    'para (inteiro i = 1; i <= n; i = i + 1) {\n' +
    'fatorial = fatorial * i\n' +
    '}\n' +
    'escreva("O fatorial de " + n + " é " + fatorial)\n' +
    '}\n' +
    '}';
  private codigoTesteVisualg = 'algoritmo "SomaDeDoisNumeros"\n' +
    'var\n' +
    'numero1, numero2, resultado: inteiro\n' +
    'inicio\n' +
    'escreva("Digite  o primeiro número:")\n' +
    'leia(numero1)\n' +
    'escreva("Digite  o seguundo número:")\n' +
    'leia(numero2)\n' +
    'resultado <- numero1 + numero2\n' +
    'escreva("A soma de", numero1, " e ", numero2, "é igual a", resultado)\n' +
    'se resultado > 1 entao\n\t' +
    'escreva("olá")\n' +
    'senao\n\t' +
    'escreva("tchau")\n' +
    'fimse\n\n' +
    'escolha resultado \n' +
    'caso 1\n\t' +
    'escreva("caso 1")\n' +
    'outrocaso\n\t' +
    'escreva("outro caso")\n' +
    'fimescolha\n\n' +
    'var i:inteiro\n' +
    'i <- 2\n' +
    '' +
    'enquanto i > 1 e i < 2 faca\n' +
    'escreva("oi")\n' +
    '' +
    'i <- i + 1' +
    'fimenquanto\n' +
    'fim_algoritmo'
  ;
  private readonly PORTUGOL_EQUIVALENCE = equivalencePortugolStudio;
  private readonly VISUALG_EQUIVALENCE = equivalenceVisuAlg;
  selectedPortugolType = PortugolType.PORTUGOL_STUDIO;
  protected readonly PORTUGOL_TYPE = PortugolType;
  private bracketsOpen: number = 0;

  constructor(private activatedRoute: ActivatedRoute) {
    const routeSnapshot = this.activatedRoute.snapshot;
    if (routeSnapshot && routeSnapshot.data) {
      if (routeSnapshot.data?.['portugolStudio']) {
        this.selectedPortugolType = PortugolType.PORTUGOL_STUDIO;
      } else if (routeSnapshot.data?.['visualAlg']) {
        this.selectedPortugolType = PortugolType.VISU_ALG;
      } else {
        this.selectedPortugolType = PortugolType.PORTUGOL_STUDIO;
      }
    } else {
      this.selectedPortugolType = PortugolType.PORTUGOL_STUDIO;
    }
  }

  ngOnInit(): void {
    this.portugolForm.setValue(this.codigoTesteVisualg);
  }

  ngAfterViewInit() {
    this.addJsToElement();
  }

  /**
   * Adiciona a tag script do plugin ao documento
   * @param src link do cdn do plugin da execuução de java
   */
  addJsToElement(
    src = 'https://www.jdoodle.com/assets/jdoodle-pym.min.js'
  ): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    document.body.appendChild(script);
    return script;
  }

  /**
   * Reseta o aparecimento do plugin, limpa as variáveis e chama o método para a criação do código JAVA
   */
  toggleJavaCode() {
    if (this.portugolForm.invalid) {
      this.portugolForm.markAllAsTouched();
      return;
    }
    this.hiddenJavaPlugin = true;
    this.text = 'import java.util.Scanner;\n';
    this.variaveis = {};
    this.bracketsOpen = 0;
    setTimeout(() => {
      if (this.selectedPortugolType === PortugolType.PORTUGOL_STUDIO) {
        this.replaceWords();
      } else {
        this.replaceWordsForVisuAlg()
      }

    }, 500);
  }

  /**
   * Cria o arquivo java para download
   */
  downloadCode() {
    const link = document.createElement('a');

    const file = new Blob([this.text], {type: 'text/plain;charset=utf-8'});

    link.href = URL.createObjectURL(file);

    link.download = 'programa.java';

    link.click();
    URL.revokeObjectURL(link.href);
  }

  /**
   * Faz toda a lógica de identificar as variaveis e seus tipos e qual termo deve ser substituido conforme a tabela de equivalência
   * @private
   */
  private replaceWords() {
    let value: string | null = this.portugolForm.value;
    // substituindo valores padrão

    value = value.replace(/programa *\n/g, 'programa');
    value = value.replace(/ +\(\) */g, '()');
    value = value.replace(/funcao inicio\(\) *\n/g, 'funcao inicio()');
    value = value.replace(
      'funcao inicio()',
      'public static void main(String[] args)'
    );
    value = value.replace('limpa()', '');

    value = value.replace('<-', ' <- ');
    value = value.replace('caso contrario', 'default');

    //Quebrando as o texto por linhas
    let val: string[] | undefined = value.split('\n');

    //substituindo palavras
    if (val != undefined) {
      for (let i = 0; i < val.length; i++) {
        // substituindo algumas expressoes
        let spl = val[i];
        spl = spl.replace('(', ' ( ');
        spl = spl.replace(')', ' ) ');
        spl = spl.replace('{', ' {');
        spl = spl.replace('}', ' }');
        spl = spl.replace(/\,/g, ' , ');
        spl = spl.replace(/\t/g, '');

        //Separando a linha por cada palavra
        let splitLine = spl.trim().split(' ');
        //Verificando se a palavra é um comando de entrada para fazer as sbstituições necessárias
        if (splitLine.includes('leia')) {
          const vars = Object.keys(this.variaveis);
          splitLine.forEach((word) => {
            let wordWithoutSpace = word.replace(' ', '').replace(/\t/g, '');
            //Verificando se é uma variavel de tipo simples
            if (vars.includes(wordWithoutSpace)) {
              // @ts-ignore
              const type = this.variaveis[wordWithoutSpace];
              this.setScanner(type, wordWithoutSpace);
            }
            // Verificando se a palavra é um array ou matriz
            else if (
              vars.includes(word.replace(new RegExp('(\\[\\d+\\])+'), ''))
            ) {
              const varNameWithoutBraketsAndNumbers = word
                .replace(new RegExp('(\\[\\d+\\])+'), '')
                .replace(',', '');
              // @ts-ignore
              const type = this.variaveis[varNameWithoutBraketsAndNumbers];
              this.setScanner(type, word);
            }
          });
        } else {
          // Reconhecendo um atribuição de variável e substituindo os termos
          for (let j = 0; j < splitLine.length; j++) {
            let word = splitLine[j];
            if (this.types.includes(word) && !splitLine.includes('para')) {
              let replacedArrayVars = this.setVars(
                spl.replace(',', '$%@#').split(' '),
                j
              );
              splitLine = splitLine.map((value1, index) => {
                if (index !== j && replacedArrayVars[index] != '$%@#') {
                  return replacedArrayVars[index];
                }
                return value1;
              });
            }

            //Verificando se a palavra existe na lista de equivalencias
            // @ts-ignore
            if (this.PORTUGOL_EQUIVALENCE?.[word]) {
              // @ts-ignore
              this.text += this.PORTUGOL_EQUIVALENCE?.[word] + ' ';
            } else {
              this.text += word + ' ';
            }

            // Verificando se é a  ultima palavra da linha então adiciona-se o ponto caso seja a ultima palavra mas o caractere for um { ouu } somente cria-se uma nova linha
            if (j === splitLine.length - 1) {
              if (word == '{' || word == '}') {
                if (val?.length - 1 != i) {
                  if (
                    val[i + 1] != '{' &&
                    (val[i].includes('se') ||
                      val[i].includes('senao') ||
                      val[i].includes('escolha') ||
                      val[i].includes('caso') ||
                      val[i].includes('enquanto') ||
                      val[i].includes('para') ||
                      val[i].includes('faca'))
                  ) {
                    this.text += '\n\t\t';
                  } else {
                    this.text += '\n';
                  }
                } else {
                  this.text += '\n';
                }
              } else if (
                (splitLine.length == 1 || splitLine.length == 2) &&
                (word == '' || word == ' ')
              ) {
                this.text += '\n\t';
              } else {
                if (
                  val[i].includes('public static void main') ||
                  (val[i].includes('programa') && splitLine.length == 1)
                ) {
                  this.text += '\n';
                } else {
                  this.text += ';\n\t';
                }
              }

              //Removendo espaços desnecessários para deixar o código mais limpo
              this.text = this.text.replace(' ( ', '(');
              this.text = this.text.replace(' ) ', ')');
              this.text = this.text.replace(' {', '{');
              this.text = this.text.replace(' }', '}');
              this.text = this.text.replace(/ \; /g, ';');
              this.text = this.text.replace(/ \;/g, ';');
              this.text = this.text.replace(/ \, /g, ',');
            }
          }
          // Importando a biblioteca do scanner
          if (splitLine.join(' ').includes('public static void main')) {
            this.text += '\tScanner scan = new Scanner(System.in); \n\t';
          }
        }
      }
      this.hiddenJavaPlugin = false;
      this.addJsToElement();
    }
  }

  /**
   * Responsável por gerar o código JAVA para os arrays e matrizes
   * @param splitLine array da linha atual que foi separada por espaços
   * @param startIndex index de começo da verificação, responsavel por indicar onde está o tipo da variável na linha atual
   * @private
   */
  private setVars(splitLine: string[], startIndex: number) {
    const arrayRegex = new RegExp('\\w+\\[(\\d)+\\]');
    const matrizRegex = new RegExp('\\w+(\\[\\d+\\]){2,}');

    const type: string = splitLine[startIndex].replace(/\t/g, '');

    for (let i = startIndex + 1; i < splitLine.length; i++) {
      if (splitLine[i] != '' && splitLine[i] != ' ' && splitLine[i] != '$%@#') {
        //Verificando se é uma matriz
        if (splitLine[i].match(matrizRegex)) {
          let newString = splitLine[i].slice();
          newString = newString.replace(',', ' ');
          newString = newString.replace(' ', '');
          newString = newString.replace(new RegExp('(\\[\\d+\\]){2,}'), '');
          let brackets = splitLine[i]
            .replace(new RegExp('\\w*'), '')
            .replace(',', '');
          while (brackets.search(new RegExp('\\d')) != -1) {
            brackets = brackets.replace(new RegExp('\\d'), '');
          }
          // @ts-ignore
          splitLine[i] =
            newString +
            ' ' +
            brackets +
            ' = new ' +
            this.getJavaType(type) +
            ' ' +
            // @ts-ignore
            splitLine[i].match(new RegExp('(\\[\\d+\\]){2,}'))[0] +
            (splitLine[i].includes(',') ? ',' : '');
          this.variaveis = {
            ...this.variaveis,
            [newString.replace(',', '')]: type,
          };
        }
        //Verificando se é vetor
        else if (splitLine[i].match(arrayRegex)) {
          let newString = splitLine[i].slice();
          newString = newString.replace(' ', '');
          newString = newString.replace(',', '');
          newString = newString.replace(new RegExp('\\[(\\d+)+\\]'), '');

          // @ts-ignore
          splitLine[i] =
            newString +
            '[] = new ' +
            this.getJavaType(type) +
            '[' +
            // @ts-ignore
            splitLine[i].match('\\d+')[0] +
            ']' +
            (splitLine[i].includes(',') ? ',' : '');
          this.variaveis = {
            ...this.variaveis,
            [newString.replace(',', '')]: type,
          };
        } else {
          this.variaveis = {
            ...this.variaveis,
            [splitLine[i].replace(',', '')]: type,
          };
        }
      }
    }
    return splitLine;
  }

  /**
   * Gera o código JAVA responsável pela entrada de dados, cada um para cada tipo de variavel primitiva
   * @param type representa o tipo primitivo da variavel em portugol
   * @param varName representa o nome dado a variável
   * @private
   */
  private setScanner(type: string, varName: string) {
    switch (type) {
      case 'inteiro':
        this.text += varName + ' = ';
        this.text += 'scan.nextInt(); \n\t';
        break;
      case 'real':
        this.text += varName + ' = ';
        this.text += 'scan.nextDouble(); \n\t';
        break;
      case 'cadeia':
        this.text += varName + ' = ';
        this.text += 'scan.nextLine(); \n\t';
        break;
      case 'caractere':
        this.text += varName + ' = ';
        this.text += 'scan.nextLine(); \n\t';
        break;
      default:
        this.text += '// não é possivel ter essa entrada de dados\n\t';
        break;
    }
  }

  /**
   * Retorna o tipo da variavel JAVA que é correspondente ao tipo indicado em portugol
   * @param type tipo da variável em portugol
   * @private
   */
  private getJavaType(type: string): string {
    switch (type) {
      case 'inteiro':
        return 'int';
      case 'real':
        return 'double';
      case 'cadeia':
        return 'String';
      default:
        return '';
    }
  }

  private replaceWordsForVisuAlg() {
    let value: string | null = this.portugolForm.value;
    value = value.replace(/algoritmo *\n/g, 'algoritmo');
    value = value.replace(/ +\(\) */g, '()');
    value = value.replace('limpa()', '');
    value = value.replace('<-', ' <- ');

    let linhas: string[] | undefined = value.split('\n');
    if (linhas != undefined) {
      let proximaLinhaDefinicaoVariavel = false;
      for (let i = 0; i < linhas.length; i++) {
        let linha = linhas[i];

        linha = linha.replace('(', ' ( ');
        linha = linha.replace(')', ' ) ');
        linha = linha.replace('{', ' {');
        linha = linha.replace('}', ' }');
        linha = linha.replace(/\,/g, ' , ');
        linha = linha.replace(/\t/g, '');
        linha = linha.replace(/"/g, ' " ');
        linha = linha.replace('<-', ' <- ');
        linha = linha.replace(/\:/g, ' : ');

        let palavras = linha.trim().split(' ');

        // Verificando se alguumas das palavra é um comando de entrada
        if (palavras.includes('leia')) {
          const vars = Object.keys(this.variaveis);
          palavras.forEach((word) => {
            let wordWithoutSpace = word.replace(' ', '').replace(/\t/g, '');
            //Verificando se é uma variavel de tipo simples
            if (vars.includes(wordWithoutSpace)) {
              // @ts-ignore
              const type = this.variaveis[wordWithoutSpace];
              this.setScanner(type, wordWithoutSpace);
            }
            // Verificando se a palavra é um array ou matriz
            else if (
              vars.includes(word.replace(new RegExp('(\\[\\d+\\])+'), ''))
            ) {
              const varNameWithoutBraketsAndNumbers = word
                .replace(new RegExp('(\\[\\d+\\])+'), '')
                .replace(',', '');
              // @ts-ignore
              const type = this.variaveis[varNameWithoutBraketsAndNumbers];
              this.setScanner(type, word);
            }
          });
          continue
        }

        if (palavras.includes('algoritmo') && i === 0) {
          const p = palavras[0] as 'algoritmo';
          palavras = palavras.filter(p => p !== '"' && p !== ' ' && p !== '');
          this.text += this.VISUALG_EQUIVALENCE?.[p] + ' ' + palavras[1] + ' {\n\t' +
            'public static void main(String[] args) {\n';
          this.text += '\tScanner scan = new Scanner(System.in); \n\t';
          this.bracketsOpen += 2;
          continue;
        }

        // identificando se a linha é o começo da definção de variável
        if (palavras.includes('var') && palavras.length <= 1) {
          proximaLinhaDefinicaoVariavel = true;
          continue;
        } else if (palavras.includes('var')) {
          console.debug(palavras)
          if (!palavras.includes('para')) {
            let replacedArrayVars = this.setVars(
              linha.replace('var', '').replace(/,/g, '$%@#').replace(':', ' ').split(' ').reverse(),
              1
            );
            console.debug(this.variaveis, replacedArrayVars)
            palavras = palavras.join(' ').split(':').join(' ').split(' ').reverse().map((value1, index) => {
              if (replacedArrayVars[index] != '$%@#') {
                return replacedArrayVars[index];
              }
              return value1;
            });
          }
        }

        if (proximaLinhaDefinicaoVariavel) {
          if (this.types.includes(palavras[palavras.length - 1]) && !palavras.includes('para')) {
            let replacedArrayVars = this.setVars(
              linha.replace(/,/g, '$%@#').replace(':', ' ').split(' ').reverse(),
              0
            );

            palavras = palavras.join(' ').replace(':', ' ').split(' ').reverse().map((value1, index) => {
              if (replacedArrayVars[index] != '$%@#') {
                return replacedArrayVars[index];
              }
              return value1;
            });
          }
          proximaLinhaDefinicaoVariavel = false;
        }

        if (palavras.includes('escreva')) {
          palavras = palavras.join(' ').replace(/,/g, '+').split(' ');
        }

        if (palavras.includes('escolha') && !palavras.includes('escreva')) {
          palavras.splice(palavras.length, 0, '){ ')
        }

        if ((palavras.includes('caso') || palavras.includes('outrocaso')) && !palavras.includes('escreva')) {
          palavras.splice(palavras.length, 0, ...[':', '\n\t'])
        }

        for (let j = 0; j < palavras.length; j++) {
          const palavra = palavras[j];

          if (palavra === 'inicio' && palavras.length <= 2) {
            break;
          }


          if (palavra === 'fim_algoritmo' || palavra === 'fimfuncao') {
            this.text += this.VISUALG_EQUIVALENCE?.[palavra] + '\n';
            this.bracketsOpen -= 1;
          }

          // @ts-ignore
          if (this.VISUALG_EQUIVALENCE?.[palavra] && !(palavras.includes('escreva') && palavra !== 'escreva' && (palavra === 'e' || this.VISUALG_EQUIVALENCE?.[palavra]))) {
            // @ts-ignore
            this.text += this.VISUALG_EQUIVALENCE[palavra] + '';
          } else {
            this.text += palavra + ' ';
          }

// Verificando se é a  ultima palavra da linha então adiciona-se o ponto caso seja a ultima palavra mas o caractere for um { ouu } somente cria-se uma nova linha
          if (j === palavras.length - 1) {
            if (palavra == '{' || palavra == '}') {
              if (linhas?.length - 1 != i) {
                if (
                  linhas[i + 1] != '{' &&
                  (linhas[i].includes('se') ||
                    linhas[i].includes('senao') ||
                    linhas[i].includes('escolha') ||
                    linhas[i].includes('caso') ||
                    linhas[i].includes('enquanto') ||
                    linhas[i].includes('para') ||
                    linhas[i].includes('faca'))
                ) {
                  this.text += '\n\t\t';
                } else {
                  this.text += '\n';
                }
              } else {
                this.text += '\n';
              }
            } else if (
              (palavras.length == 1 || palavras.length == 2) &&
              (palavra == '' || palavra == ' ')
            ) {
              this.text += '\n\t';
            } else {
              if (
                linhas[i].includes('public static void main') ||
                (linhas[i].includes('algoritmo') && palavras.length == 1)
              ) {
                this.text += '\n';
              } else {
                if ((linha.includes('escolha') || linha.includes("caso")) && !linha.includes('escreva')) {
                  this.text += '\n\t\t'
                } else if ((linha.includes('se') && linha.includes('entao')) ||
                  linha.includes('fimse') ||
                  linha.includes('senao') || linha.includes('faca')) {
                  this.text += linha.includes('fimse') ? '\n\t' : '\n\t\t';
                } else {
                  this.text += linha.includes('fimenquanto') ? '\n\t' : ';\n\t';
                }
              }
            }

            //Removendo espaços desnecessários para deixar o código mais limpo
            this.text = this.text.replace(' ( ', '(');
            this.text = this.text.replace(' ) ', ')');
            this.text = this.text.replace(' {', '{');
            this.text = this.text.replace(' }', '}');
            this.text = this.text.replace(/ \; /g, ';');
            this.text = this.text.replace(/ \;/g, ';');
            this.text = this.text.replace(/ \, /g, ',');
            //this.text = this.text.replace(/( )*/g, '');
          }
        }
      }
      this.hiddenJavaPlugin = false;
      this.addJsToElement();
    }
  }
}
