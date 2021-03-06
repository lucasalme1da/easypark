#include "main.h"

#include "string.h"
int main(void) {
  Destino *destinos = le_destino();

  Vaga *vagas = le_vagas();

  Tag *tags = alocar_vetor_tags(conta_linhas_vagas());

  while (1) {
    char *comando = mandar_comando("idle;");
    char comandoInicial[200];
    strcpy(comandoInicial, comando);

    char fluxo = comando[0];

    if (fluxo == 'A') {
      // Primeiro Fluxo - Cálculo de melhor vaga com base no destino

      Destino destino = le_input(destinos, conta_linhas_destinos());

      Vaga *ranking_de_vagas = calcula_vaga(destino, vagas);

      Vaga vaga_disponivel = verifica_vaga(ranking_de_vagas, tags);

      if (strcmp(vaga_disponivel.nome, "Nao ha vagas") != 0) {
        atribuir_vaga(comandoInicial, vaga_disponivel, tags);
      }

      exibe_info(vaga_disponivel);

    } else if (fluxo == 'B') {
      // Segundo Fluxo - Verifica se as informações recebidas correspondem à
      // vaga

      confirmar_vaga(comando, tags);
    } else if (fluxo == 'C') {
      // Terceiro Fluxo - Desaloca as informações da vaga em questão.

      desalocar_vaga(comando, tags);
    }
  }
}
