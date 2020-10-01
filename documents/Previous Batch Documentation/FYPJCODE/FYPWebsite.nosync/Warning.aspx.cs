using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

public partial class Warning : System.Web.UI.Page
{
    string strConnString = ConfigurationManager.ConnectionStrings["EventConnectionString"].ConnectionString;
    string str, sit;
    SqlCommand com, cam;
    protected void Page_Load(object sender, EventArgs e)
    {
        // Database Conn
        SqlConnection con = new SqlConnection(strConnString);
        con.Open();
        str = "select EventName, Date, Time, Venue from Events";
        com = new SqlCommand(str, con);
        SqlDataReader reader = com.ExecuteReader();
        //Database Read
        reader.Read();
        lblVenue.Text = reader["Venue"].ToString();
        con.Close();
        con.Open();
        sit = "select SeatNo, Status from Seats";
        cam = new SqlCommand(sit, con);
        SqlDataReader seaters = cam.ExecuteReader();
        seaters.Read();
        con.Close();
        if (Session["guest"].ToString() == "1")
        {
            string message = "Your Seat Number is A1  ";
            TextBox1.Text = message;
        }
        else if (Session["guest"].ToString() =="2")
        {
            string message = "Your Seat Numer is F2, F3";
            TextBox1.Text = message;
        }
        else if (Session["guest"].ToString() == "3")
        {
            string message = "Your Seat Numer is E4, E5, E6";
            TextBox1.Text = message;
        }
        else if (Session["guest"].ToString() == "4")
        {
            string message = "Your Seat Numer is A7, A8, A9, A10";
            TextBox1.Text = message;
        }
        else if (Session["guest"].ToString() == "5")
        {
            string message = "Your Seat Numer is B1, B2, B3, B4, B5";
            TextBox1.Text = message;
        }



    }

    protected void btnBack_Click(object sender, EventArgs e)
    {

    }
}