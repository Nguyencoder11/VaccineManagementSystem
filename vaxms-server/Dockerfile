# Build app with maven
FROM maven:3.8.5-openjdk-17 as builder
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

# Run app with JDK
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Read env variable from docker-compose
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "app.jar"]