FROM mcr.microsoft.com/dotnet/runtime:7.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["FCWorkbench.Api/FCWorkbench.Api.csproj", "FCWorkbench.Api/"]
RUN dotnet restore "FCWorkbench.Api/FCWorkbench.Api.csproj"
COPY . .
WORKDIR "/src/FCWorkbench.Api"
RUN dotnet build "FCWorkbench.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "FCWorkbench.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FCWorkbench.Api.dll"]
