﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Journaliser.Logic.Domain.Model
{
    public class User
    {
        public string UserId { get; set; }
        public string Password { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public DateTime DateOfBirth { get; set; }
    }
}
