FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY backend/mvnw backend/pom.xml ./backend/
COPY backend/.mvn ./backend/.mvn
COPY backend/src ./backend/src

WORKDIR /app/backend

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/*.jar"]