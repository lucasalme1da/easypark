#include "exibe_info.h"
#include "comunicacao.h"

void exibe_info(Vaga vaga) {
  mandar_comando(vaga.nome);
}