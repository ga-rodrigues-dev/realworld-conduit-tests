# Stage 1: Build
FROM gradle:7.6.1-jdk17 AS build
WORKDIR /app
COPY . .
RUN ./gradlew clean build -x test

# Stage 2: Run
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
