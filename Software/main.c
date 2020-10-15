#include "main.h"

#include "string.h"
int main(void) {
  char *p1;

  Destino *destinos = le_destino();

  Vaga *vagas = le_vagas();

  Tag *tags = alocar_vetor_tags(conta_linhas_vagas());

  while (1) {
    char *comando = mandar_comando("idle;");
    char placeholder[200];
    strcpy(placeholder, comando);

    char fluxo = comando[0];

    if (fluxo == 'A') {
      Destino destino = le_input(destinos, conta_linhas_destinos());

      Vaga *ranking_de_vagas = calcula_vaga(destino, vagas);

      Vaga vaga_disponivel = verifica_vaga(ranking_de_vagas);

      if (strcmp(vaga_disponivel.nome, "Nao ha vagas") != 0) {
        atribuir_vaga(placeholder, vaga_disponivel, tags);
      }

      exibe_info(vaga_disponivel);

    } else if (fluxo == 'B') {
      confirmar_vaga(comando, tags);

    } else if (fluxo == 'C') {
      desalocar_vaga(comando, tags);
    }
  }
}
