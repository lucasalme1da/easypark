#ifndef COMUNICACAO_H_
#define COMUNICACAO_H_
#include "tipos.h"

void limpar_arquivo(char*);
//Espera uma entrada de dados e retorna ao receber
char* aguardar_comando();
//Envia dados para a simulção e retorna a resposta (Coloque o caracter de fim de comando ";") 
char* mandar_comando(char*);

/*Limpa o arquivo*/
#endif  // COMUNICACAO_H_