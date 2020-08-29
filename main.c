#include "main.h"
#include "string.h"
int main(void) {
  Destino d;
  Destino d2;
  Destino d3;
  Vaga v;

  strcpy(d.nome,"Destino 1");
  strcpy(d2.nome,"Destino 2");
  strcpy(d3.nome,"Destino 3");

  Destino destinos[] = {d,d2,d3};
  int tamanho_vetor = sizeof(destinos) / sizeof(destinos[0]);
  Destino destino_escolhido = le_input(destinos,tamanho_vetor);
  printf("Destino escolhido %s",destino_escolhido.nome);

  // le_arquivos(&d, &v);
  // le_input(&d);
  // calcula_vaga(d, &v); 
  // verifica_vaga(&v);
  // exibe_info("jarrada");



  return (0);
}