#include "comunicacao.h"
#ifndef TRUE
#define TRUE 1
#endif
#ifndef FALSE
#define FALSE -1
#endif
#define CARACTER_FIM_DE_COMANDO 59 //%
char* nome_arquivo_envio_de_comando_sync = "escrita";
char* nome_arquivo_recebimento_de_comando_sync = "leitura";
//Como testar ***
//Para testar a funcao comunicação deve ser capaz de recever uma string
//e escrever esta string no arquivo designado para a escrita
//assim que o arquivo de leitura tiver terminado de ser escrito, isto sendo determinado pelo caracter de fim de comando
//o que foi escrito deve ser retornado.
void init(){
    
}
void limpaArquivo(char* arquivo){
    fclose(fopen(arquivo,"w"));
}
char* comunicacao(char* dados) { 
    printf("Comando Enviado: %s \nAguardando resposta...\n",dados);
    char comando[300];
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
    limpaArquivo(nome_arquivo_recebimento_de_comando_sync);
    printf("Comando Recebido: %s \n",comando);
}
