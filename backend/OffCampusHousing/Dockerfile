# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Install redis-tools to make redis-cli available
RUN apt-get update && apt-get install -y redis-tools

# Copy your application files and build the app (this part depends on your build system)
COPY . /app
WORKDIR /app

# Set the working directory
#WORKDIR /app

# Copy the JAR file into the container
COPY target/OffCampusHousing-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
