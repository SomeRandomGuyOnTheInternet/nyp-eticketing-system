using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Data;
using System.Data.SqlClient;

public partial class InputPage : System.Web.UI.Page
{
    // Database Conn
    string strConnString = ConfigurationManager.ConnectionStrings["EventConnectionString"].ConnectionString;
    string str;
    SqlCommand com;
    protected void Page_Load(object sender, EventArgs e)
    {

        SqlConnection con = new SqlConnection(strConnString);
        con.Open();
        str = "select EventName, Date, Time, Venue from Events";
        com = new SqlCommand(str, con);
        SqlDataReader reader = com.ExecuteReader();
        //Database Read
        reader.Read();
        lblEvent.Text = reader["EventName"].ToString();
        lblDate.Text = reader["Date"].ToString().Substring(0, 8);
        lblTime.Text = reader["Time"].ToString();
        venue = reader["Venue"].ToString();
        con.Close();
        //sms done(?)
        websvc();
    }
    string venue;
    //Connecting to SMS service - not done
    SMS.SMS Proxy = new SMS.SMS();
    
    HttpClient client = new HttpClient();

    protected void btnCfm_Click(object sender, EventArgs e)
    {
        string guest = txtGuest.Text;
        Session["guest"] = txtGuest.Text;
        Session["Needs"] = RadioButtonList1.Text;
        string number = "";
        number = txtHP.Text;

        if (RadioButtonList1.SelectedItem.Text == "Handicapped")
        {
            if (txtGuest.Text == "1")
            {
                string message = "Your Seat Number is E4 at " + venue + " on " + lblDate.Text + " at " + lblTime.Text + " for " + guest + " guest(s)";
                string account = "FYPJ01";
                string password = "529287";
                try
                {
                    string display = Proxy.sendMessage(account, password, number, message);

                }
                catch (Exception error)
                {
                    Console.WriteLine(error);
                }
                Response.Redirect("Warning.aspx");
            }
            else if (txtGuest.Text == "2")
            {
                string message = "Your Seat Number is E2,E3 at " + venue + " on " + lblDate.Text + " at " + lblTime.Text + " for " + guest + " guest(s)";
                string account = "FYPJ01";
                string password = "529287";
                try
                {
                    string display = Proxy.sendMessage(account, password, number, message);

                }
                catch (Exception error)
                {
                    Console.WriteLine(error);
                }
                Response.Redirect("Warning.aspx");
            }
            else if (txtGuest.Text == "3")
            {
                string message = "Your Seat Number is E4, E5, E6 " + venue + " on " + lblDate.Text + " at " + lblTime.Text + " for " + guest + " guest(s)";
                string account = "FYPJ01";
                string password = "529287";
                try
                {
                    string display = Proxy.sendMessage(account, password, number, message);

                }
                catch (Exception error)
                {
                    Console.WriteLine(error);
                }
                Response.Redirect("Warning.aspx");
            }
            else if (txtGuest.Text == "4")
            {
                string message = "Your Seat Number is E7, E8, E9, E10 at " + venue + " on " + lblDate.Text + " at " + lblTime.Text + " for " + guest + " guest(s)";
                string account = "FYPJ01";
                string password = "529287";

                try
                {
                    string display = Proxy.sendMessage(account, password, number, message);

                }
                catch (Exception error)
                {
                    Console.WriteLine(error);
                }
                Response.Redirect("Warning.aspx");
            }
            else if (txtGuest.Text == "5")
            {
                string message = "Your Seat Number is E5, E6, E7, E8, E9 at " + venue + " on " + lblDate.Text + " at " + lblTime.Text + " for " + guest + " guest(s)";
                string account = "FYPJ01";
                string password = "529287";

                try
                {
                    string display = Proxy.sendMessage(account, password, number, message);

                }
                catch (Exception error)
                {
                    Console.WriteLine(error);
                }
                Response.Redirect("Warning.aspx");
            }
        }
        else if (RadioButtonList1.SelectedItem.Text == "Special Needs")
        {
            if (txtGuest.Text == "1")
            {
                string message = "Your Seat Number is F4 at " + venue + " on " + lblDate.Text + " at " + lblTime.Text + " for " + guest + " guest(s)";
                string account = "FYPJ01";
                string password = "529287";
                try
                {
                    string display = Proxy.sendMessage(account, password, number, message);

                }
                catch (Exception error)
                {
                    Console.WriteLine(error);
                }
                Response.Redirect("Warning.aspx");
            }
            else if (txtGuest.Text == "2")
            {
                string message = "Your Seat Number is F2,F3 at " + venue + " on " + lblDate.Text + " at " + lblTime.Text + " for " + guest + " guest(s)";
                string account = "FYPJ01";
                string password = "529287";
                try
                {
                    string display = Proxy.sendMessage(account, password, number, message);

                }
                catch (Exception error)
                {
                    Console.WriteLine(error);
                }
                Response.Redirect("Warning.aspx");
            }
            else if (txtGuest.Text == "3")
            {
                string message = "Your Seat Number is F4, F5, F6 " + venue + " on " + lblDate.Text + " at " + lblTime.Text + " for " + guest + " guest(s)";
                string account = "FYPJ01";
                string password = "529287";
                try
                {
                    string display = Proxy.sendMessage(account, password, number, message);

                }
                catch (Exception error)
                {
                    Console.WriteLine(error);
                }
                Response.Redirect("Warning.aspx");
            }
            else if (txtGuest.Text == "4")
            {
                string message = "Your Seat Number is F7, F8, F9, F10 at " + venue + " on " + lblDate.Text + " at " + lblTime.Text + " for " + guest + " guest(s)";
                string account = "FYPJ01";
                string password = "529287";

                try
                {
                    string display = Proxy.sendMessage(account, password, number, message);

                }
                catch (Exception error)
                {
                    Console.WriteLine(error);
                }
                Response.Redirect("Warning.aspx");
            }
            else if (txtGuest.Text == "5")
            {
                string message = "Your Seat Number is F2, F3, F4, F5, F6 at " + venue + " on " + lblDate.Text + " at " + lblTime.Text + " for " + guest + " guest(s)";
                string account = "FYPJ01";
                string password = "529287";

                try
                {
                    string display = Proxy.sendMessage(account, password, number, message);

                }
                catch (Exception error)
                {
                    Console.WriteLine(error);
                }
                Response.Redirect("Warning.aspx");
            }
        }
        else if (RadioButtonList1.SelectedItem.Text == "Normal")
        {
            if (txtGuest.Text == "1")
            {
                string message = "Your Seat Number is A1 at " + venue + " on " + lblDate.Text + " at " + lblTime.Text + " for " + guest + " guest(s)";
                string account = "FYPJ01";
                string password = "529287";
                try
                {
                    string display = Proxy.sendMessage(account, password, number, message);

                }
                catch (Exception error)
                {
                    Console.WriteLine(error);
                }
                Response.Redirect("Warning.aspx");
            }
            else if (txtGuest.Text == "2")
            {
                string message = "Your Seat Number is A2,A3 at " + venue + " on " + lblDate.Text + " at " + lblTime.Text + " for " + guest + " guest(s)";
                string account = "FYPJ01";
                string password = "529287";
                try
                {
                    string display = Proxy.sendMessage(account, password, number, message);

                }
                catch (Exception error)
                {
                    Console.WriteLine(error);
                }
                Response.Redirect("Warning.aspx");
            }
            else if (txtGuest.Text == "3")
            {
                string message = "Your Seat Number is A4, A5, A6 " + venue + " on " + lblDate.Text + " at " + lblTime.Text + " for " + guest + " guest(s)";
                string account = "FYPJ01";
                string password = "529287";
                try
                {
                    string display = Proxy.sendMessage(account, password, number, message);

                }
                catch (Exception error)
                {
                    Console.WriteLine(error);
                }
                Response.Redirect("Warning.aspx");
            }
            else if (txtGuest.Text == "4")
            {
                string message = "Your Seat Number is A7, A8, A9, A10 at " + venue + " on " + lblDate.Text + " at " + lblTime.Text + " for " + guest + " guest(s)";
                string account = "FYPJ01";
                string password = "529287";

                try
                {
                    string display = Proxy.sendMessage(account, password, number, message);

                }
                catch (Exception error)
                {
                    Console.WriteLine(error);
                }
                Response.Redirect("Warning.aspx");
            }
            else if (txtGuest.Text == "5")
            {
                string message = "Your Seat Number is B1, B2, B3, B4, B5 at " + venue + " on " + lblDate.Text + " at " + lblTime.Text + " for " + guest + " guest(s)";
                string account = "FYPJ01";
                string password = "529287";

                try
                {
                    string display = Proxy.sendMessage(account, password, number, message);

                }
                catch (Exception error)
                {
                    Console.WriteLine(error);
                }
                Response.Redirect("Warning.aspx");
            }
        }




    }
    private void websvc()
    {
        client.BaseAddress = new Uri("http://sms.sit.nyp.edu.sg/SMSWebService/sms.asmx");
    }



}