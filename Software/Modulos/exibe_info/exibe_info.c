#include "exibe_info.h"

#include "../comunicacao/comunicacao.h"
#include "string.h"

void exibe_info(Vaga vaga) {
  char resposta[80];
  strcpy(resposta,"vaga ");
  strcat(resposta,vaga.nome);
  strcat(resposta,";");
  mandar_comando(resposta);
}
