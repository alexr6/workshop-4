import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { REGISTRY_PORT } from "../config";


export type Node = { nodeId: number; pubKey: string };

export type RegisterNodeBody = {
  nodeId: number;
  pubKey: string;
};

export type GetNodeRegistryBody = {
  nodes: Node[];
};



//initialise node registry
let nodeRegistry: Node[] = [];

export async function launchRegistry() {
  const _registry = express();
  _registry.use(express.json());
  _registry.use(bodyParser.json());

  //implement the status route
  _registry.get("/status", (req, res) => {res.send("live");});

  // Route to allow nodes to register themselves
  _registry.post("/registerNode", (req, res) => {
    const { nodeId, pubKey } = req.body;
    const existingNode = nodeRegistry.find(node => node.nodeId === nodeId);
    if (existingNode) {
      return res.status(400).send("Node already registered.");
    }
    const newNode: Node = { nodeId, pubKey };
    nodeRegistry.push(newNode);
    return res.status(200).send("Node registered.");
  });

  const server = _registry.listen(REGISTRY_PORT, () => {
    console.log(`registry is listening on port ${REGISTRY_PORT}`);
  });

  return server;
}
