FROM mcr.microsoft.com/dotnet/runtime:7.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["FCWorkbench/FCWorkbench.csproj", "FCWorkbench/"]
RUN dotnet restore "FCWorkbench/FCWorkbench.csproj"
COPY . .
WORKDIR "/src/FCWorkbench"
RUN dotnet build "FCWorkbench.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "FCWorkbench.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FCWorkbench.dll"]
