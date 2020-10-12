#include "exibe_info.h "

#include "../comunicacao/comunicacao.h"
#include "string.h"

void exibe_info(Vaga vaga) { mandar_comando(strcat(vaga.nome, ";")); }