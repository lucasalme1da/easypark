#ifndef LE_INPUT_H_
#define LE_INPUT_H_
#include "../../tipos.h"

/* Se comunicará com a simualação checando qual destino foi selecionado e
  retorna um destino. */
Destino le_input(Destino*, int);

#endif  // LE_INPUT_H_