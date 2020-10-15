#ifndef VERIFICA_TAG_H_
#define VERIFICA_TAG_H_
#include <stdbool.h>

#include "../../tipos.h"

/*Cada função estará presente em um fluxo do programa .*/
Tag* alocar_vetor_tags(int);
void atribuir_vaga(char*, Vaga, Tag*);
void confirmar_vaga(char*, Tag*);
void desalocar_vaga(char*, Tag*);

#endif  // VERIFICA_TAG_H_
