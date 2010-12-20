using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace Journaliser.Logic.Domain.Model
{
    public class User : BaseDocument
    {
        [Required]
        [Display(Name = "User name")]
        public string Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }
        
        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }

        [Display(Name="First Name")]
        [StringLength(40)]
        public string Firstname { get; set; }
        
        [StringLength(100)]
        public string Lastname { get; set; }
        public DateTime? DateOfBirth { get; set; }

        [DataType(DataType.EmailAddress)]
        [Display(Name = "Email address")]
        public string Email { get; set; }    
}
}
