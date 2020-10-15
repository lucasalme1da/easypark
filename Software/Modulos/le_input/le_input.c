#include "../le_input/le_input.h"

#include "../comunicacao/comunicacao.h"
#include "errno.h"
// Recebe da simulação qual o input seleciona e retorna o input específico
//É importante que a ordem do vetor de inputs seja a mesma da simulação.
Destino le_input(Destino* vetor_destinos, int tamanho_vetor) {
  char comando[] = "destino;";
  char* resposta = mandar_comando(comando);

  int indice_vetor = atoi(resposta);
  if (indice_vetor < 0 || indice_vetor > (tamanho_vetor - 1)) {
    perror("le_input: Indice recebido fora dos limites do vetor.");
    exit(-1);
  } else {
    return vetor_destinos[atoi(resposta)];
  }
}
