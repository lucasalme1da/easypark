#include "main.h"

int main(void) {
  Destino d;
  Vaga v;

  // le_arquivos(&d, &v);
  // le_input(&d);
  // calcula_vaga(d, &v);
  // verifica_vaga(&v);
  // exibe_info("jarrada");

  char comando[] = "estado sensor 1;";
  char* resposta = mandar_comando(comando);
  printf("Comando Recebido: %s \n",resposta);



  char* novo_comando = aguardar_comando();
  printf("Comando recebido: %s\n",novo_comando);


  return (0);
}