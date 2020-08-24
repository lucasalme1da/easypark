#include "main.h"

int main(void) {
  Destino *destino = le_destino();
  Vaga *vaga = le_vagas();

  for(int i = 0; i < 3; i++){
    printf("%s\n", destino[i].nome);
    printf("%.2f\n", destino[i].ponto.y);
    printf("%.2f\n", destino[i].ponto.x);
    printf("%.2f\n\n", destino[i].ponto.z);
  }
  
  for(int j = 0; j < 20; j++){
    printf("%s\n", vaga[j].nome);
    printf("%.2f\n", vaga[j].ponto.x);
    printf("%.2f\n", vaga[j].ponto.y);
    printf("%.2f\n", vaga[j].ponto.z);
    printf("%d\n", vaga[j].sensor.id);
    printf("%.2f\n\n", vaga[j].distancia_euclidiana); 
  }
  
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