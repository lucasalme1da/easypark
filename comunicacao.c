#include "comunicacao.h"
#ifndef TRUE
#define TRUE 1
#endif
#ifndef FALSE
#define FALSE -1
#endif
#define CARACTER_FIM_DE_COMANDO 59 //;
char* nome_arquivo_envio_de_comando_sync = "escrita";
char* nome_arquivo_recebimento_de_comando_sync = "leitura";
//Como testar ***
//Para testar a funcao comunicação deve ser capaz de recever uma string
//e escrever esta string no arquivo designado para a escrita
//assim que o arquivo de leitura tiver terminado de ser escrito, isto sendo determinado pelo caracter de fim de comando
//o que foi escrito deve ser retornado.

char comando[300];

char* mandar_comando(char* dados) { 
    comando[0] = '\0';
    printf("Comando Enviado: %s \nAguardando resposta...\n",dados);
    FILE *escrita = fopen(nome_arquivo_envio_de_comando_sync,"w");
    fprintf(escrita,"%s",dados);
    fclose(escrita);
    char caracter_atual;
    int contador_caracter = 0;
    int achou_fim_de_comando = FALSE;
    while(achou_fim_de_comando != TRUE){
        FILE *leitura = fopen(nome_arquivo_recebimento_de_comando_sync,"r");
        caracter_atual = fgetc(leitura);
        while(caracter_atual != EOF){
            comando[contador_caracter] = caracter_atual;  
            contador_caracter++;
            if(caracter_atual == CARACTER_FIM_DE_COMANDO){
                achou_fim_de_comando = TRUE;
                comando[contador_caracter] = '\0';
                break;
            }
            caracter_atual = fgetc(leitura);
        }
        contador_caracter = 0;
        fclose(leitura);
    }
    limpar_arquivo(nome_arquivo_recebimento_de_comando_sync);
    return comando;
}
char* aguardar_comando(){
    printf("Aguardando um comando da simulação...\n");
    comando[0] = '\0';
    char caracter_atual;
    int contador_caracter = 0;
    int achou_fim_de_comando = FALSE;
    while(achou_fim_de_comando != TRUE){
        FILE *leitura = fopen(nome_arquivo_recebimento_de_comando_sync,"r");
        caracter_atual = fgetc(leitura);
        while(caracter_atual != EOF){
            comando[contador_caracter] = caracter_atual;  
            contador_caracter++;
            if(caracter_atual == CARACTER_FIM_DE_COMANDO){
                achou_fim_de_comando = TRUE;
                comando[contador_caracter] = '\0';
                break;
            }
            caracter_atual = fgetc(leitura);
        }
        contador_caracter = 0;
        fclose(leitura);
    }
    limpar_arquivo(nome_arquivo_recebimento_de_comando_sync);
    return comando;
}
void limpar_arquivo(char* arquivo){
    fclose(fopen(arquivo,"w"));
}
  // char comando[] = "estado sensor 1;";
  // char* resposta = mandar_comando(comando);
  // printf("Comando Recebido: %s \n",resposta);

  // char* novo_comando = aguardar_comando();
  // printf("Comando recebido: %s\n",novo_comando);