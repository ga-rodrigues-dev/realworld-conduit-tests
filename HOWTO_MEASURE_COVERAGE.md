# Guia de Coleta e Geração de Relatório JaCoCo com Docker

Para garantir que o arquivo `jacoco.exec` seja salvo corretamente e que você consiga gerar o relatório de cobertura, siga as instruções abaixo.

## 1. Como Parar o Contêiner Corretamente

O agente JaCoCo escreve o arquivo `jacoco.exec` no sistema de arquivos quando a JVM é encerrada de forma graciosa. O `Ctrl+C` no terminal onde o `docker-compose up` está rodando pode enviar um sinal de interrupção abrupto.

**A maneira recomendada é usar o comando `stop` em um novo terminal:**

1.  Mantenha o `docker-compose up` rodando.
2.  Abra um **novo terminal** na mesma pasta do projeto.
3.  Execute o comando:
    ```bash
    docker-compose stop backend
    ```
    *Este comando envia um sinal `SIGTERM` para a JVM, permitindo que ela execute os "shutdown hooks" e o agente JaCoCo salve o arquivo.*

4.  Verifique se o arquivo foi criado em: `./realworld-springboot-java/jacoco/jacoco.exec`.

---

## 2. Como Gerar o Relatório JaCoCo

Uma vez que você tenha o arquivo `jacoco.exec` na pasta local, você pode usar o Gradle para gerar o relatório HTML.

### Ajuste no `build.gradle` (Certifique-se de que está assim)

O Gradle precisa saber onde procurar o arquivo `.exec` gerado pelo Docker. No seu `build.gradle`, a configuração deve apontar para a pasta onde o volume foi mapeado.

```gradle
jacocoTestReport {
    // Indica ao Gradle para usar o arquivo .exec gerado pelo agente no Docker
    executionData.setFrom(fileTree(project.rootDir).include("jacoco/*.exec"))
    
    reports {
        html.required = true
        xml.required = true
    }
}
```

### Comando para Gerar o Relatório

No seu terminal local (fora do Docker), navegue até a pasta do backend e execute:

```bash
cd realworld-springboot-java
./gradlew jacocoTestReport
```

### Onde encontrar o relatório?

O relatório será gerado em:
`realworld-springboot-java/build/reports/jacoco/jacocoTestReport/html/index.html`

Abra o arquivo `index.html` no seu navegador para visualizar a cobertura.

---

## Dicas Adicionais

*   **Permissões**: Se o arquivo não estiver sendo criado, verifique se a pasta `jacoco` no seu host tem permissões de escrita para o usuário que o Docker utiliza (geralmente o comando `chmod 777 realworld-springboot-java/jacoco` resolve em ambientes de desenvolvimento).
*   **Limpeza**: Antes de uma nova coleta, é recomendável apagar o arquivo `jacoco.exec` antigo para não misturar os dados de execuções diferentes.
*   **Logs**: Se o arquivo continuar vazio, verifique os logs do backend ao parar: `docker-compose logs backend`. Você deverá ver mensagens de encerramento da JVM.
