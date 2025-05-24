# Use OpenJDK 23 base image (Alpine if size is a concern)
FROM eclipse-temurin:23-jdk-alpine

# Set working directory
WORKDIR /app

# Copy the jar (after building it with Maven)
COPY target/demo-0.0.1-SNAPSHOT.jar app.jar

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
