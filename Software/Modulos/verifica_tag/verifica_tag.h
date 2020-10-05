#ifndef VERIFICA_TAG_H_
#define VERIFICA_TAG_H_
#include <stdbool.h>
#include "../../tipos.h"

/*Cada função estará presente em um fluxo do programa .*/
void atribuir_vaga(Vaga, Tag*);
bool confirmar_vaga(char*);
void desalocar_vaga(char*);

#endif //VERIFICA_TAG_H_