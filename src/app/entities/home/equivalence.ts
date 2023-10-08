export const equivalencePortugolStudio = {
  programa: 'public class program',
  inteiro: 'int',
  real: 'double',
  logico: 'boolean',
  cadeia: 'String',
  caracter: 'char',
  escreva: 'System.out.println',
  '<-': '=',
  'Matematica.potencia': 'Math.pow',
  'Matematica.raiz': 'Math.sqrt',
  nao: '!',
  ou: '||',
  e: '&&',
  se: 'if',
  senao: 'else',
  escolha: 'switch',
  caso: 'case',
  pare: 'break',
  enquanto: 'while',
  para: 'for',
  faca: 'do',
  procedimento: 'static',
  vazio: 'void',
  funcao: 'static',
};

export const equivalenceVisuAlg = {
  'algoritmo': 'public class',
  inteiro: 'int',
  real: 'double',
  logico: 'boolean',
  caractere: 'String',
  escreva: 'System.out.println',
  escreval: 'System.out.println',
  '<-': '=',
  '^': 'Math.pow', // TODO: potenciação não funciona
  RaizQ: 'Math.sqrt',
  '=': '==',
  '<>': '!=',
  nao: '!',
  ou: '||',
  e: '&&',
  se: 'if (',
  entao: '){',
  fimse: '}',
  senao: '}else {',
  escolha: 'switch (', // TODO: resolver como ser feito
  caso: 'case ', // TODO: resolver como ser feito
  outrocaso: 'default',
  enquanto: 'while (',
  faca: ') {',
  fimenquanto: '}',
  para: 'for( ', // TODO: resolver como ser feito
  fimpara: "}",
  repita: 'do {',
  ate: '} while(',
  interrompa: 'break',
  procedimento: 'static', //TODO: final do comando não terá {}
  vazio: 'void',
  fimprocedimento: '}',
  inicio: '',
  funcao: 'static',
  fimfuncao: '}',
  fim_algoritmo: '}',
  fimalgoritmo: '}',
  fimescolha: '}',
  de: '= '
};
