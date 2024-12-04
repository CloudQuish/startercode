import { IRelationship, ITable } from "@/interfaces/statics-data.interface";
import { Node, Edge } from "@xyflow/react";
import { nanoid } from "nanoid";

export const initialPosition = { x: 100, y: 200 };

export const initialTables: ITable[] = [
  {
    id: "tab-users",
    name: "Users",
    columns: [
      {
        id: "col-user-id",
        name: "id",
        type: "integer",
        isPrimaryKey: true,
        isNullable: false,
      },
      {
        id: "col-user-name",
        name: "name",
        type: "varchar",
        isPrimaryKey: false,
        isNullable: false,
      },
      {
        id: "col-user-email",
        name: "email",
        type: "varchar",
        isPrimaryKey: false,
        isNullable: false,
      },
    ],
  },
  {
    id: "tab-posts",
    name: "Posts",
    columns: [
      {
        id: "col-post-id",
        name: "id",
        type: "integer",
        isPrimaryKey: true,
        isNullable: false,
      },
      {
        id: "col-post-user-id",
        name: "user_id",
        type: "integer",
        isPrimaryKey: false,
        isNullable: false,
      },
      {
        id: "col-post-content",
        name: "content",
        type: "text",
        isPrimaryKey: false,
        isNullable: false,
      },
    ],
  },
  {
    id: "tab-comments",
    name: "Comments",
    columns: [
      {
        id: "col-comment-id",
        name: "id",
        type: "integer",
        isPrimaryKey: true,
        isNullable: false,
      },
      {
        id: "col-comment-post-id",
        name: "post_id",
        type: "integer",
        isPrimaryKey: false,
        isNullable: false,
      },
      {
        id: "col-comment-user-id",
        name: "user_id",
        type: "integer",
        isPrimaryKey: false,
        isNullable: false,
      },
      {
        id: "col-comment-content",
        name: "content",
        type: "text",
        isPrimaryKey: false,
        isNullable: false,
      },
    ],
  },
  {
    id: "tab-likes",
    name: "Likes",
    columns: [
      {
        id: "col-like-id",
        name: "id",
        type: "integer",
        isPrimaryKey: true,
        isNullable: false,
      },
      {
        id: "col-like-post-id",
        name: "post_id",
        type: "integer",
        isPrimaryKey: false,
        isNullable: false,
      },
      {
        id: "col-like-user-id",
        name: "user_id",
        type: "integer",
        isPrimaryKey: false,
        isNullable: false,
      },
    ],
  },
  {
    id: "tab-followers",
    name: "Followers",
    columns: [
      {
        id: "col-follower-id",
        name: "id",
        type: "integer",
        isPrimaryKey: true,
        isNullable: false,
      },
      {
        id: "col-followed-user-id",
        name: "followed_user_id",
        type: "integer",
        isPrimaryKey: false,
        isNullable: false,
      },
      {
        id: "col-following-user-id",
        name: "following_user_id",
        type: "integer",
        isPrimaryKey: false,
        isNullable: false,
      },
    ],
  },
];

export const initialRelationships: IRelationship[] = [
  {
    id: nanoid(),
    name: "Users to Posts",
    sourceTableId: "tab-users",
    targetTableId: "tab-posts",
    sourceColumnId: "col-user-id",
    targetColumnId: "col-post-user-id",
    type: "one-to-many",
  },
  {
    id: nanoid(),
    name: "Users to Comments",
    sourceTableId: "tab-users",
    targetTableId: "tab-comments",
    sourceColumnId: "col-user-id",
    targetColumnId: "col-comment-user-id",
    type: "one-to-many",
  },
  {
    id: nanoid(),
    name: "Posts to Comments",
    sourceTableId: "tab-posts",
    targetTableId: "tab-comments",
    sourceColumnId: "col-post-id",
    targetColumnId: "col-comment-post-id",
    type: "one-to-many",
  },
  {
    id: nanoid(),
    name: "Users to Likes",
    sourceTableId: "tab-users",
    targetTableId: "tab-likes",
    sourceColumnId: "col-user-id",
    targetColumnId: "col-like-user-id",
    type: "one-to-many",
  },
  {
    id: nanoid(),
    name: "Posts to Likes",
    sourceTableId: "tab-posts",
    targetTableId: "tab-likes",
    sourceColumnId: "col-post-id",
    targetColumnId: "col-like-post-id",
    type: "one-to-many",
  },
];

export const initialNodes: Node[] = initialTables.map((table, index) => ({
  id: table.id,
  type: "tableNode",
  position: { x: initialPosition.x + index * 300, y: initialPosition.y },
  data: { table },
}));

export const initialEdges: Edge[] = initialRelationships.map((rel) => ({
  id: rel.id,
  source: rel.sourceTableId,
  target: rel.targetTableId,
  sourceHandle: `${rel.sourceTableId}-${rel.sourceColumnId}`,
  targetHandle: `${rel.targetTableId}-${rel.targetColumnId}`,
  type: "smoothstep",
  animated: true,
  label: rel.name,
}));
