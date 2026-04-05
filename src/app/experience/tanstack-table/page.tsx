"use client";

import React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

// 模擬資料
type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
};

const defaultData: Person[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    age: 28,
    email: "john@example.com",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    age: 34,
    email: "jane@example.com",
  },
  {
    id: 3,
    firstName: "Bob",
    lastName: "Johnson",
    age: 22,
    email: "bob@example.com",
  },
  {
    id: 4,
    firstName: "Alice",
    lastName: "Brown",
    age: 30,
    email: "alice@example.com",
  },
];

export default function Page() {
  const [data, setData] = React.useState(() => [...defaultData]);

  const columnHelper = createColumnHelper<Person>();

  const columns = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("firstName", { header: "First Name" }),
    columnHelper.accessor("lastName", { header: "Last Name" }),
    columnHelper.accessor("age", { header: "Age" }),
    columnHelper.accessor("email", { header: "Email" }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <h1>TanStack Table Example</h1>
      <table border={1} cellPadding={5} cellSpacing={0}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
