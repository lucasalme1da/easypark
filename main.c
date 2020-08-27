#include "main.h"

int main(void) {
  Destino *destino = le_destino();
  Vaga *vaga = le_vagas();
  // Destino destino = le_input();
  Destino destino_usuario = destino[1];

  Vaga *ranking_de_vagas = calcula_vaga(destino_usuario, vaga);

  // listar_vagas(ranking_de_vagas);

  printf("\n\n%s\n\n", verifica_vaga(ranking_de_vagas).nome);

  free(destino);
  free(vaga);

  /* le_input(&d);
  calcula_vaga(d, &v);
  verifica_vaga(&v);
  exibe_info("jarrada");
  comunicacao("dados"); */

  system("pause");
  return (0);
}