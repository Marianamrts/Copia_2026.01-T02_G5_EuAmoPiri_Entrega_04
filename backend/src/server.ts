import "dotenv/config";
import express, { type Request, type Response } from "express";
import placeRoutes from "./routes/placeRoutes.ts";
import experienceRoutes from "./routes/experienceRoutes.ts";

const app = express();
const PORT = process.env.PORT || 3000;


//Permite que o express entenda o corpo das requisições em JSON
app.use(express.json());


//Rota raiz (para verificar se o servidor está online)
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Bem-vindo À API do Eu Amo Piri!'})
});

app.use('/places', placeRoutes);

app.use('/places', experienceRoutes);

//inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

