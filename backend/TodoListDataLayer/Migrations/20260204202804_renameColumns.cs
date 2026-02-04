using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoListDataLayer.Migrations
{
    /// <inheritdoc />
    public partial class renameColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TodoListItems",
                table: "TodoListItems");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "TodoListItems");

            migrationBuilder.RenameTable(
                name: "TodoListItems",
                newName: "Tasks");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Tasks",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "IsComplete",
                table: "Tasks",
                newName: "IsCompleted");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tasks",
                table: "Tasks",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Tasks",
                table: "Tasks");

            migrationBuilder.RenameTable(
                name: "Tasks",
                newName: "TodoListItems");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "TodoListItems",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "IsCompleted",
                table: "TodoListItems",
                newName: "IsComplete");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "TodoListItems",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_TodoListItems",
                table: "TodoListItems",
                column: "Id");
        }
    }
}
