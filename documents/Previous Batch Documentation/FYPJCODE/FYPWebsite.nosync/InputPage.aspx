<%@ Page Language="C#" AutoEventWireup="true" CodeFile="InputPage.aspx.cs" Inherits="InputPage" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>InputPage</title>
      <style>
      .HeadLbl{
         text-align:center;
         align-content:center;
         font-weight:bold;
         font-size:large;
        }
      .InputLbl{
          text-align:center;
          align-items:center;
          font-weight:bold;
          font-size:medium;
          margin-top:10px;
          align-content:center;
      }
      .Btn{
          height:30px;
          width:120px;
          margin-left:20px;
          background-color:#00E300;

      }
      .rbtn{
        align-content:center;
        position:absolute;
        right:700px;
      }
       </style>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
</head>
<body>

    <div class="d-flex justify-content-between py-2 px-5 mb-3" style="background-color: #5271FF;">
            <img src="images/NYP.png" style="height: 69px; width: 81px;" />
            <span style="line-height: 55px; font-size: 1.5em;" class="font-weight-bold">E-Ticketing System</span>
        </div>
    <form id="form1" runat="server" style="text-align:center">
        <div class="HeadLbl">
            <asp:Label ID="Label5" runat="server" Text="Event:" style="text-align:justify"></asp:Label><asp:Label ID="lblEvent" runat="server"></asp:Label>
        </div>
        <div class="HeadLbl">
            <asp:Label ID="Label6" runat="server" Text="Date:" style="text-align:justify"></asp:Label><asp:Label ID="lblDate" runat="server" ></asp:Label>
        </div>
                <div class="HeadLbl">
            <asp:Label ID="Label7" runat="server" Text="Time:" style="text-align:justify"></asp:Label><asp:Label ID="lblTime" runat="server"></asp:Label>
        </div>
    <div class="InputLbl">
        &nbsp;
        <asp:Label ID="Label1" runat="server" Text="Enter the number of guests" CssClass="aligncenter" ></asp:Label>
        <asp:TextBox ID="txtGuest" runat="server" MaxLength="1"></asp:TextBox>
        <asp:Label ID="Label2" runat="server" Text="(Maximum is 5)" ForeColor="#CCCCCC"></asp:Label>
        <asp:RangeValidator ID="RangeValidator1" runat="server" ControlToValidate="txtGuest" ErrorMessage="Maximum Number of Guests is 5" ForeColor="Red" MaximumValue="5" MinimumValue="1" SetFocusOnError="True"></asp:RangeValidator>
        <br />
        <br />
        <asp:Label ID="Label3" runat="server" Text="Enter your phone number"></asp:Label>
        <asp:TextBox ID="txtHP" runat="server" MaxLength="8"></asp:TextBox>
        <asp:Label ID="Label4" runat="server" Text="(For message confirmation)" ForeColor="Silver"></asp:Label>
        <asp:Button ID="btnCfm" class="Btn" runat="server"  Text="Confirm" OnClick="btnCfm_Click"  />
        <br />
        <asp:RegularExpressionValidator ID="RegularExpressionValidator1" runat="server" ControlToValidate="txtHP" ErrorMessage="Please Enter a Valid Phone Number" ForeColor="Red" ValidationExpression="^[89]\d{7}$"></asp:RegularExpressionValidator>
        <br />
         <div class="rbtn">
            <asp:RadioButtonList ID="RadioButtonList1" runat="server" >
            <asp:ListItem>Special Needs</asp:ListItem>
            <asp:ListItem>Handicapped</asp:ListItem>
            <asp:ListItem>Normal</asp:ListItem>
        </asp:RadioButtonList>
        </div>
    </div>
    </form>
</body>
</html>