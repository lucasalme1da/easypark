#ifndef COMUNICACAO_H_
#define COMUNICACAO_H_
#include "tipos.h"

/* Realiza a comunicacao entre a simulacao e o software por meio de
 * leitura/escrita de arquivos. (Coloque o caracter de fim de comando ";") */
void limpar_arquivo(char*);
void init();
char* comunicacao(char*);

/*Limpa o arquivo*/
#endif  // COMUNICACAO_H_